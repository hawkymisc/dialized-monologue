/**
 * 設定ストア
 *
 * Zustandによる設定の状態管理
 */

import { create } from 'zustand';
import { Settings, ReminderTime } from '../types';
import { StorageService } from '../services/storage';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;
}

interface SettingsActions {
  loadSettings: () => Promise<void>;
  addReminderTime: (time: ReminderTime) => Promise<void>;
  updateReminderTime: (index: number, time: ReminderTime) => Promise<void>;
  removeReminderTime: (index: number) => Promise<void>;
  toggleReminderTime: (index: number) => Promise<void>;
  setDarkMode: (isDarkMode: boolean) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  getEnabledReminderTimes: () => ReminderTime[];
  clearError: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const DEFAULT_SETTINGS: Settings = {
  reminderTimes: [],
  isDarkMode: false,
  notificationsEnabled: true,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // State
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  // Actions
  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await StorageService.getSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  addReminderTime: async (time: ReminderTime) => {
    try {
      const newSettings: Settings = {
        ...get().settings,
        reminderTimes: [...get().settings.reminderTimes, time],
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  updateReminderTime: async (index: number, time: ReminderTime) => {
    try {
      const newReminderTimes = [...get().settings.reminderTimes];
      newReminderTimes[index] = time;
      const newSettings: Settings = {
        ...get().settings,
        reminderTimes: newReminderTimes,
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  removeReminderTime: async (index: number) => {
    try {
      const newReminderTimes = get().settings.reminderTimes.filter(
        (_, i) => i !== index
      );
      const newSettings: Settings = {
        ...get().settings,
        reminderTimes: newReminderTimes,
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  toggleReminderTime: async (index: number) => {
    try {
      const newReminderTimes = get().settings.reminderTimes.map((t, i) =>
        i === index ? { ...t, isEnabled: !t.isEnabled } : t
      );
      const newSettings: Settings = {
        ...get().settings,
        reminderTimes: newReminderTimes,
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  setDarkMode: async (isDarkMode: boolean) => {
    try {
      const newSettings: Settings = {
        ...get().settings,
        isDarkMode,
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  setNotificationsEnabled: async (enabled: boolean) => {
    try {
      const newSettings: Settings = {
        ...get().settings,
        notificationsEnabled: enabled,
      };
      await StorageService.saveSettings(newSettings);
      set({ settings: newSettings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  getEnabledReminderTimes: () => {
    return get().settings.reminderTimes.filter((t) => t.isEnabled);
  },

  clearError: () => {
    set({ error: null });
  },
}));
