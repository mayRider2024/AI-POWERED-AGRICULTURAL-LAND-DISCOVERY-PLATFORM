import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SavedContextProps {
  savedIds: string[];
  toggleSave: (id: string) => void;
}

const SavedContext = createContext<SavedContextProps>({ savedIds: [], toggleSave: () => {} });

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedProperties') || '[]') as string[];
    setSavedIds(stored);
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((s) => s !== id) : [...prev, id];
      localStorage.setItem('savedProperties', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
