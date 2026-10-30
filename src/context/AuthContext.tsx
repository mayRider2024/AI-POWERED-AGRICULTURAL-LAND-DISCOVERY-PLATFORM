import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types/profile';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  emailVerifiedNotification: boolean;
  isPasswordRecovery: boolean;
  clearEmailVerified: () => void;
  clearPasswordRecovery: () => void;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteAccount: (passwordConfirmation?: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'full_name' | 'preferred_district' | 'preferred_language' | 'user_role'>>) => Promise<{ error: Error | null; data: UserProfile | null }>;
  refreshProfile: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Returns the appropriate redirect URL depending on the current platform:
 * - On Native Android/iOS: uses custom deep link scheme 'landlens://auth/callback'
 * - On Web (PC/Laptop): uses public web origin (e.g. production domain, or window.location.origin)
 */
export function getAuthRedirectUrl(path: string = '/home'): string {
  const isNative = Capacitor.isNativePlatform();
  if (isNative) {
    // Custom scheme deep-link registered in AndroidManifest.xml
    return path.includes('reset-password')
      ? 'landlens://auth/reset-password'
      : 'landlens://auth/callback';
  }

  // Web environment (PC or laptop browser)
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // If running on a non-localhost domain, use current origin
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return `${origin}${path}`;
    }
  }

  // Fallback to configured web URL or current origin
  return typeof window !== 'undefined' ? `${window.location.origin}${path}` : 'landlens://auth/callback';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [emailVerifiedNotification, setEmailVerifiedNotification] = useState<boolean>(false);

  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);

  const clearEmailVerified = () => {
    setEmailVerifiedNotification(false);
  };

  const clearPasswordRecovery = () => {
    setIsPasswordRecovery(false);
  };

  /**
   * Fetches or automatically backfills the public.user_profiles row for the authenticated user.
   */
  const fetchProfileForUser = async (userId: string, currentUser?: User | null) => {
    if (!isSupabaseConfigured) return;
    setProfileLoading(true);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile:', error.message);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Safe automatic backfill for existing or pre-migration users
        const targetUser = currentUser || (await supabase.auth.getUser()).data.user;
        const defaultName =
          targetUser?.user_metadata?.full_name ||
          targetUser?.user_metadata?.display_name ||
          (targetUser?.email ? targetUser.email.split('@')[0] : 'User');
        const defaultLang = (targetUser?.user_metadata?.preferred_language as 'en' | 'mr' | 'hi') || 'en';

        const { data: inserted, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            full_name: defaultName,
            preferred_language: defaultLang,
            user_role: 'land_seeker',
          })
          .select()
          .single();

        if (insertError) {
          console.warn('Profile backfill insertion error:', insertError.message);
        } else if (inserted) {
          setProfile(inserted as UserProfile);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading user profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Initial active session fetch
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          fetchProfileForUser(initialSession.user.id, initialSession.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to retrieve initial Supabase session:', err);
        setLoading(false);
      });

    // 2. Subscribe to auth changes (sign in, sign out, token refresh, password recovery)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchProfileForUser(currentUser.id, currentUser);
      } else {
        setProfile(null);
      }

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
    });

    // 3. Listen for Capacitor native deep links (for email verification & password recovery)
    let appUrlListener: { remove: () => void } | null = null;
    let lastHandledDeepLink = '';

    CapApp.addListener('appUrlOpen', async (data) => {
      try {
        const urlStr = data.url;
        if (!urlStr || urlStr === lastHandledDeepLink) return;
        lastHandledDeepLink = urlStr;

        const isRecoveryPath = urlStr.includes('reset-password') || urlStr.includes('type=recovery');

        // Case A: PKCE exchange code query parameter (?code=...)
        if (urlStr.includes('code=')) {
          const queryIdx = urlStr.indexOf('?');
          if (queryIdx !== -1) {
            const queryParams = new URLSearchParams(urlStr.substring(queryIdx + 1));
            const code = queryParams.get('code');
            if (code) {
              const { error } = await supabase.auth.exchangeCodeForSession(code);
              if (error) {
                console.error('Error exchanging PKCE code for session:', error.message);
              } else {
                if (isRecoveryPath) {
                  setIsPasswordRecovery(true);
                } else {
                  setEmailVerifiedNotification(true);
                }
              }
              return;
            }
          }
        }

        // Case B: Implicit flow / hash tokens (#access_token=...&refresh_token=...)
        if (urlStr.includes('access_token=')) {
          const hashIdx = urlStr.indexOf('#');
          if (hashIdx !== -1) {
            const hash = urlStr.substring(hashIdx + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (type === 'recovery' || isRecoveryPath) {
                setIsPasswordRecovery(true);
              } else {
                setEmailVerifiedNotification(true);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error handling deep link URL:', err);
      }
    }).then((handle) => {
      appUrlListener = handle;
    });

    return () => {
      subscription.unsubscribe();
      if (appUrlListener) {
        appUrlListener.remove();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase credentials are not configured. Please add VITE_SUPABASE_ANON_KEY to .env.',
        } as AuthError,
      };
    }
    const res = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: res.error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase credentials are not configured. Please add VITE_SUPABASE_ANON_KEY to .env.',
        } as AuthError,
        user: null,
      };
    }

    const emailRedirectTo = getAuthRedirectUrl('/home');

    const res = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo,
        data: {
          display_name: displayName?.trim() || email.split('@')[0],
        },
      },
    });
    return { error: res.error, user: res.data.user };
  };

  /**
   * Secure SignOut: invalidates session and wipes in-memory sensitive state.
   */
  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsPasswordRecovery(false);
    setEmailVerifiedNotification(false);

    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const res = await supabase.auth.signOut();
      return { error: res.error };
    } catch (err: unknown) {
      // Even if network error occurs, local session is cleared
      console.warn('Sign out encountered network notice:', err);
      return { error: null };
    }
  };

  /**
   * Secure Account Deletion:
   * Reauthenticates with password (if provided) and calls the server-side delete_user_account RPC function.
   * Supabase automatically cascades deletion to public.user_profiles and public.saved_properties.
   */
  const deleteAccount = async (passwordConfirmation?: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('User is not authenticated') };
    }

    try {
      // If password confirmation was entered, verify credentials first
      if (passwordConfirmation && user.email) {
        const { error: reauthErr } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: passwordConfirmation,
        });
        if (reauthErr) {
          return { error: new Error(reauthErr.message) };
        }
      }

      // Invoke the secure SECURITY DEFINER RPC
      const { data, error: rpcErr } = await supabase.rpc('delete_user_account');
      if (rpcErr) {
        return { error: new Error(rpcErr.message) };
      }

      console.info('Account deleted successfully:', data);

      // Wipe local state and sign out
      await signOut();
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Account deletion failed';
      return { error: new Error(msg) };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase credentials are not configured. Please add VITE_SUPABASE_ANON_KEY to .env.',
        } as AuthError,
      };
    }

    const redirectTo = getAuthRedirectUrl('/reset-password');

    const res = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    return { error: res.error };
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'SupabaseNotConfigured',
          message: 'Supabase credentials are not configured.',
        } as AuthError,
      };
    }
    const res = await supabase.auth.updateUser({ password: newPassword });
    return { error: res.error };
  };

  /**
   * Updates user profile in public.user_profiles using RLS policy (auth.uid() = id).
   */
  const updateProfile = async (
    updates: Partial<Pick<UserProfile, 'full_name' | 'preferred_district' | 'preferred_language' | 'user_role'>>
  ): Promise<{ error: Error | null; data: UserProfile | null }> => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('User is not authenticated'), data: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: new Error(error.message), data: null };
      }

      const updated = data as UserProfile;
      setProfile(updated);
      return { error: null, data: updated };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      return { error: new Error(msg), data: null };
    }
  };

  /**
   * Refreshes user profile from public.user_profiles
   */
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await fetchProfileForUser(user.id, user);
    }
  };

  /**
   * Helper for backend calls: returns verified JWT access token
   * to send in the `Authorization: Bearer <token>` header.
   */
  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        profileLoading,
        isConfigured: isSupabaseConfigured,
        emailVerifiedNotification,
        isPasswordRecovery,
        clearEmailVerified,
        clearPasswordRecovery,
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        deleteAccount,
        updateProfile,
        refreshProfile,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
