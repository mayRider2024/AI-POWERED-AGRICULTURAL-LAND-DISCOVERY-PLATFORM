import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { properties } from '../data/properties';

const LOCAL_STORAGE_SAVED_KEY = 'savedProperties';
const KNOWN_PROPERTY_IDS = new Set(properties.map((p) => p.id));

export interface SavedContextProps {
  savedIds: string[];
  loading: boolean;
  error: string | null;
  toggleSave: (propertyId: string) => Promise<boolean>;
  isSaved: (propertyId: string) => boolean;
  refreshSaved: () => Promise<void>;
  localBookmarksMigrated: boolean;
  guestPromptModalOpen: boolean;
  setGuestPromptModalOpen: (open: boolean) => void;
  pendingGuestPropertyId: string | null;
}

const SavedContext = createContext<SavedContextProps>({
  savedIds: [],
  loading: false,
  error: null,
  toggleSave: async () => false,
  isSaved: () => false,
  refreshSaved: async () => {},
  localBookmarksMigrated: false,
  guestPromptModalOpen: false,
  setGuestPromptModalOpen: () => {},
  pendingGuestPropertyId: null,
});

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localBookmarksMigrated, setLocalBookmarksMigrated] = useState<boolean>(false);
  const [guestPromptModalOpen, setGuestPromptModalOpen] = useState<boolean>(false);
  const [pendingGuestPropertyId, setPendingGuestPropertyId] = useState<string | null>(null);

  /**
   * Helper to safely read valid known local bookmarks from localStorage.
   */
  const getValidLocalBookmarks = (): string[] => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === 'string' && KNOWN_PROPERTY_IDS.has(id));
      }
    } catch {
      // Ignore JSON parse errors
    }
    return [];
  };

  /**
   * Cloud Fetch: Loads the authenticated user's saved_properties records from Supabase.
   */
  const loadCloudSaved = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchErr } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', userId);

      if (fetchErr) {
        throw fetchErr;
      }

      const cloudIds = (data || [])
        .map((row) => row.property_id)
        .filter((id) => KNOWN_PROPERTY_IDS.has(id));

      // Check if there are local bookmarks to migrate for this newly/authenticated account
      const localIds = getValidLocalBookmarks();
      const idsToMerge = localIds.filter((id) => !cloudIds.includes(id));

      if (idsToMerge.length > 0) {
        const rowsToInsert = idsToMerge.map((propId) => ({
          user_id: userId,
          property_id: propId,
        }));

        const { error: insertErr } = await supabase
          .from('saved_properties')
          .insert(rowsToInsert);

        if (!insertErr) {
          // Merge succeeded! Combine and clear local storage so it doesn't leak
          const combined = Array.from(new Set([...cloudIds, ...idsToMerge]));
          setSavedIds(combined);
          localStorage.removeItem(LOCAL_STORAGE_SAVED_KEY);
          setLocalBookmarksMigrated(true);
        } else {
          console.warn('Local bookmark merge deferred:', insertErr.message);
          setSavedIds(cloudIds);
        }
      } else {
        // No local bookmarks needing merge; or previously merged
        if (localIds.length > 0) {
          localStorage.removeItem(LOCAL_STORAGE_SAVED_KEY);
        }
        setSavedIds(cloudIds);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch saved properties';
      console.warn('Error loading cloud saved properties:', msg);
      setError(msg);
      // Fallback in case of offline/network failure
      setSavedIds(getValidLocalBookmarks());
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Synchronization lifecycle:
   * When user signs in -> fetch from Supabase (and safely migrate local bookmarks).
   * When user is guest / logged out -> use local storage state only.
   */
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadCloudSaved(user.id);
    } else {
      // Guest state: read from local storage
      const local = getValidLocalBookmarks();
      setSavedIds(local);
      setLoading(false);
      setError(null);
    }
  }, [user, loadCloudSaved]);

  /**
   * Toggles save/bookmark state with optimistic UI update and network rollback on failure.
   */
  const toggleSave = async (propertyId: string): Promise<boolean> => {
    if (!KNOWN_PROPERTY_IDS.has(propertyId)) {
      return false;
    }

    // 1. Guest Experience: prompt login without creating anonymous accounts
    if (!user) {
      setPendingGuestPropertyId(propertyId);
      setGuestPromptModalOpen(true);
      return false;
    }

    // 2. Authenticated Cloud Sync with Optimistic Update
    const isCurrentlySaved = savedIds.includes(propertyId);
    const prevSavedIds = [...savedIds];
    const optimisticIds = isCurrentlySaved
      ? prevSavedIds.filter((id) => id !== propertyId)
      : [...prevSavedIds, propertyId];

    // Immediately update UI optimistically
    setSavedIds(optimisticIds);
    setError(null);

    try {
      if (isCurrentlySaved) {
        // Delete from Supabase
        const { error: delError } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (delError) throw delError;
      } else {
        // Insert into Supabase (UNIQUE(user_id, property_id) protects against duplicates)
        const { error: insError } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });

        if (insError && !insError.message.includes('duplicate key')) {
          throw insError;
        }
      }
      return true;
    } catch (err: unknown) {
      // Rollback optimistic state
      setSavedIds(prevSavedIds);
      const msg = err instanceof Error ? err.message : 'Unable to sync saved property to cloud';
      console.error('Bookmark sync error:', msg);
      setError(msg);
      return false;
    }
  };

  const isSaved = (propertyId: string): boolean => {
    return savedIds.includes(propertyId);
  };

  const refreshSaved = async () => {
    if (user && isSupabaseConfigured) {
      await loadCloudSaved(user.id);
    }
  };

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        loading,
        error,
        toggleSave,
        isSaved,
        refreshSaved,
        localBookmarksMigrated,
        guestPromptModalOpen,
        setGuestPromptModalOpen,
        pendingGuestPropertyId,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
