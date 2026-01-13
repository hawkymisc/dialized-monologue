/**
 * 設定ストアのテスト
 *
 * TDD: RED -> GREEN -> REFACTOR
 */

import { useSettingsStore } from '../../src/stores/settingsStore';
import { StorageService } from '../../src/services/storage';
import { Settings, ReminderTime } from '../../src/types';

// StorageServiceをモック
jest.mock('../../src/services/storage', () => ({
  StorageService: {
    getSettings: jest.fn(),
    saveSettings: jest.fn(),
  },
}));

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('useSettingsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({
      settings: {
        reminderTimes: [],
        isDarkMode: false,
        notificationsEnabled: true,
      },
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have default settings', () => {
      const state = useSettingsStore.getState();
      expect(state.settings.reminderTimes).toEqual([]);
      expect(state.settings.isDarkMode).toBe(false);
      expect(state.settings.notificationsEnabled).toBe(true);
    });
  });

  describe('loadSettings', () => {
    it('should load settings from storage', async () => {
      const mockSettings: Settings = {
        reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
        isDarkMode: true,
        notificationsEnabled: true,
      };
      mockStorageService.getSettings.mockResolvedValue(mockSettings);

      await useSettingsStore.getState().loadSettings();

      expect(useSettingsStore.getState().settings).toEqual(mockSettings);
    });
  });

  describe('addReminderTime', () => {
    it('should add new reminder time', async () => {
      mockStorageService.saveSettings.mockResolvedValue();
      const newTime: ReminderTime = { hour: 7, minute: 30, isEnabled: true };

      await useSettingsStore.getState().addReminderTime(newTime);

      expect(useSettingsStore.getState().settings.reminderTimes).toContainEqual(newTime);
    });
  });

  describe('updateReminderTime', () => {
    it('should update reminder time at index', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      const updatedTime: ReminderTime = { hour: 22, minute: 30, isEnabled: true };
      await useSettingsStore.getState().updateReminderTime(0, updatedTime);

      expect(useSettingsStore.getState().settings.reminderTimes[0]).toEqual(updatedTime);
    });
  });

  describe('removeReminderTime', () => {
    it('should remove reminder time at index', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [
            { hour: 7, minute: 0, isEnabled: true },
            { hour: 21, minute: 0, isEnabled: true },
          ],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().removeReminderTime(0);

      expect(useSettingsStore.getState().settings.reminderTimes).toHaveLength(1);
      expect(useSettingsStore.getState().settings.reminderTimes[0].hour).toBe(21);
    });
  });

  describe('toggleReminderTime', () => {
    it('should toggle reminder time enabled state', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().toggleReminderTime(0);

      expect(useSettingsStore.getState().settings.reminderTimes[0].isEnabled).toBe(false);
    });
  });

  describe('setDarkMode', () => {
    it('should set dark mode', async () => {
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().setDarkMode(true);

      expect(useSettingsStore.getState().settings.isDarkMode).toBe(true);
    });
  });

  describe('setNotificationsEnabled', () => {
    it('should set notifications enabled', async () => {
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().setNotificationsEnabled(false);

      expect(useSettingsStore.getState().settings.notificationsEnabled).toBe(false);
    });
  });

  describe('getEnabledReminderTimes', () => {
    it('should return only enabled reminder times', () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [
            { hour: 7, minute: 0, isEnabled: true },
            { hour: 12, minute: 0, isEnabled: false },
            { hour: 21, minute: 0, isEnabled: true },
          ],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });

      const enabled = useSettingsStore.getState().getEnabledReminderTimes();

      expect(enabled).toHaveLength(2);
      expect(enabled[0].hour).toBe(7);
      expect(enabled[1].hour).toBe(21);
    });
  });
});
