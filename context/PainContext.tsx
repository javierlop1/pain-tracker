import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PainEntry } from '@/types';
import { getPainEntries, savePainEntries } from '@/utils/storage';

interface PainContextType {
  painEntries: PainEntry[];
  addPainEntry: (entry: PainEntry) => Promise<void>;
  removePainEntry: (id: string) => Promise<void>;
  setPainEntries: React.Dispatch<React.SetStateAction<PainEntry[]>>;
}

const PainContext = createContext<PainContextType | undefined>(undefined);

interface PainProviderProps {
  children: ReactNode;
}

export function PainProvider({ children }: PainProviderProps) {
  const [painEntries, setPainEntries] = useState<PainEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load pain entries from storage on initial render
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const entries = await getPainEntries();
        if (entries) {
          setPainEntries(entries);
        }
      } catch (error) {
        console.error('Error loading pain entries:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadEntries();
  }, []);

  // Save entries to storage whenever they change
  useEffect(() => {
    if (isInitialized) {
      savePainEntries(painEntries).catch(error => {
        console.error('Error saving pain entries:', error);
      });
    }
  }, [painEntries, isInitialized]);

  // Add a new pain entry
  const addPainEntry = async (entry: PainEntry) => {
    setPainEntries((prevEntries) => [...prevEntries, entry]);
  };

  // Remove a pain entry by ID
  const removePainEntry = async (id: string) => {
    setPainEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  return (
    <PainContext.Provider
      value={{
        painEntries,
        addPainEntry,
        removePainEntry,
        setPainEntries,
      }}
    >
      {children}
    </PainContext.Provider>
  );
}

// Custom hook for using the pain context
export function usePainContext() {
  const context = useContext(PainContext);
  if (context === undefined) {
    throw new Error('usePainContext must be used within a PainProvider');
  }
  return context;
}