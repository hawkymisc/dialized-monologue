/**
 * 日記ストア
 *
 * Zustandによる日記エントリーの状態管理
 */

import { create } from 'zustand';
import { DiaryEntry, DiaryAnswer } from '../types';
import { StorageService } from '../services/storage';

interface DiaryState {
  entries: DiaryEntry[];
  isLoading: boolean;
  error: string | null;
}

interface DiaryActions {
  loadEntries: () => Promise<void>;
  addEntry: (entry: DiaryEntry) => Promise<void>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryByDate: (date: string) => DiaryEntry | undefined;
  getEntryById: (id: string) => DiaryEntry | undefined;
  addAnswerToEntry: (entryId: string, answer: DiaryAnswer) => Promise<void>;
  clearError: () => void;
}

type DiaryStore = DiaryState & DiaryActions;

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  // State
  entries: [],
  isLoading: false,
  error: null,

  // Actions
  loadEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await StorageService.getDiaryEntries();
      set({ entries, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  addEntry: async (entry: DiaryEntry) => {
    try {
      await StorageService.saveDiaryEntry(entry);
      set((state) => ({
        entries: [...state.entries, entry],
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  updateEntry: async (entry: DiaryEntry) => {
    try {
      await StorageService.saveDiaryEntry(entry);
      set((state) => ({
        entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  deleteEntry: async (id: string) => {
    try {
      await StorageService.deleteDiaryEntry(id);
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  getEntryByDate: (date: string) => {
    return get().entries.find((e) => e.date === date);
  },

  getEntryById: (id: string) => {
    return get().entries.find((e) => e.id === id);
  },

  addAnswerToEntry: async (entryId: string, answer: DiaryAnswer) => {
    const entry = get().getEntryById(entryId);
    if (!entry) return;

    const updatedEntry: DiaryEntry = {
      ...entry,
      updatedAt: new Date().toISOString(),
      answers: [...entry.answers, answer],
    };

    await get().updateEntry(updatedEntry);
  },

  clearError: () => {
    set({ error: null });
  },
}));
