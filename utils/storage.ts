import AsyncStorage from '@react-native-async-storage/async-storage';
import { PainEntry } from '@/types';

const PAIN_ENTRIES_KEY = 'pain_tracker_entries';

/**
 * Retrieves all pain entries from AsyncStorage
 */
export const getPainEntries = async (): Promise<PainEntry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(PAIN_ENTRIES_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error retrieving pain entries:', error);
    return [];
  }
};

/**
 * Saves all pain entries to AsyncStorage
 */
export const savePainEntries = async (entries: PainEntry[]): Promise<void> => {
  try {
    const entriesJson = JSON.stringify(entries);
    await AsyncStorage.setItem(PAIN_ENTRIES_KEY, entriesJson);
  } catch (error) {
    console.error('Error saving pain entries:', error);
    throw error;
  }
};

/**
 * Adds a single pain entry to AsyncStorage
 */
export const addPainEntry = async (entry: PainEntry): Promise<void> => {
  try {
    const entries = await getPainEntries();
    entries.push(entry);
    await savePainEntries(entries);
  } catch (error) {
    console.error('Error adding pain entry:', error);
    throw error;
  }
};

/**
 * Removes a single pain entry from AsyncStorage by ID
 */
export const removePainEntry = async (id: string): Promise<void> => {
  try {
    const entries = await getPainEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    await savePainEntries(updatedEntries);
  } catch (error) {
    console.error('Error removing pain entry:', error);
    throw error;
  }
};