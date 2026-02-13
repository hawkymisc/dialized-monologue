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

  describe('エラーハンドリング', () => {
    it('loadSettings失敗時にerror状態が設定されisLoadingがfalseになる', async () => {
      mockStorageService.getSettings.mockRejectedValue(new Error('Storage read failed'));

      await useSettingsStore.getState().loadSettings();

      const state = useSettingsStore.getState();
      expect(state.error).toBe('Storage read failed');
      expect(state.isLoading).toBe(false);
    });

    it('loadSettings失敗時に非Errorオブジェクトの場合はUnknown errorになる', async () => {
      mockStorageService.getSettings.mockRejectedValue('string error');

      await useSettingsStore.getState().loadSettings();

      expect(useSettingsStore.getState().error).toBe('Unknown error');
      expect(useSettingsStore.getState().isLoading).toBe(false);
    });

    it('addReminderTime失敗時にerror状態が設定される', async () => {
      mockStorageService.saveSettings.mockRejectedValue(new Error('Save failed'));

      await useSettingsStore.getState().addReminderTime({ hour: 8, minute: 0, isEnabled: true });

      expect(useSettingsStore.getState().error).toBe('Save failed');
    });

    it('addReminderTime失敗時に非Errorの場合はUnknown errorになる', async () => {
      mockStorageService.saveSettings.mockRejectedValue(42);

      await useSettingsStore.getState().addReminderTime({ hour: 8, minute: 0, isEnabled: true });

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('updateReminderTime失敗時にerror状態が設定される', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue(new Error('Update failed'));

      await useSettingsStore.getState().updateReminderTime(0, { hour: 22, minute: 0, isEnabled: true });

      expect(useSettingsStore.getState().error).toBe('Update failed');
    });

    it('updateReminderTime失敗時に非Errorの場合はUnknown errorになる', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue(null);

      await useSettingsStore.getState().updateReminderTime(0, { hour: 22, minute: 0, isEnabled: true });

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('removeReminderTime失敗時にerror状態が設定される', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 7, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue(new Error('Remove failed'));

      await useSettingsStore.getState().removeReminderTime(0);

      expect(useSettingsStore.getState().error).toBe('Remove failed');
    });

    it('removeReminderTime失敗時に非Errorの場合はUnknown errorになる', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 7, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue(undefined);

      await useSettingsStore.getState().removeReminderTime(0);

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('toggleReminderTime失敗時にerror状態が設定される', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue(new Error('Toggle failed'));

      await useSettingsStore.getState().toggleReminderTime(0);

      expect(useSettingsStore.getState().error).toBe('Toggle failed');
    });

    it('toggleReminderTime失敗時に非Errorの場合はUnknown errorになる', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockRejectedValue({ code: 500 });

      await useSettingsStore.getState().toggleReminderTime(0);

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('setDarkMode失敗時にerror状態が設定される', async () => {
      mockStorageService.saveSettings.mockRejectedValue(new Error('Dark mode save failed'));

      await useSettingsStore.getState().setDarkMode(true);

      expect(useSettingsStore.getState().error).toBe('Dark mode save failed');
    });

    it('setDarkMode失敗時に非Errorの場合はUnknown errorになる', async () => {
      mockStorageService.saveSettings.mockRejectedValue('fail');

      await useSettingsStore.getState().setDarkMode(true);

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('setNotificationsEnabled失敗時にerror状態が設定される', async () => {
      mockStorageService.saveSettings.mockRejectedValue(new Error('Notification save failed'));

      await useSettingsStore.getState().setNotificationsEnabled(false);

      expect(useSettingsStore.getState().error).toBe('Notification save failed');
    });

    it('setNotificationsEnabled失敗時に非Errorの場合はUnknown errorになる', async () => {
      mockStorageService.saveSettings.mockRejectedValue(0);

      await useSettingsStore.getState().setNotificationsEnabled(false);

      expect(useSettingsStore.getState().error).toBe('Unknown error');
    });

    it('clearErrorでerror状態がnullになる', () => {
      useSettingsStore.setState({ error: 'Some error' });

      useSettingsStore.getState().clearError();

      expect(useSettingsStore.getState().error).toBeNull();
    });
  });

  describe('境界値', () => {
    it('addReminderTime hour=0, minute=0で正常に追加される', async () => {
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().addReminderTime({ hour: 0, minute: 0, isEnabled: true });

      const times = useSettingsStore.getState().settings.reminderTimes;
      expect(times).toHaveLength(1);
      expect(times[0]).toEqual({ hour: 0, minute: 0, isEnabled: true });
    });

    it('addReminderTime hour=23, minute=59で正常に追加される', async () => {
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().addReminderTime({ hour: 23, minute: 59, isEnabled: true });

      const times = useSettingsStore.getState().settings.reminderTimes;
      expect(times).toHaveLength(1);
      expect(times[0]).toEqual({ hour: 23, minute: 59, isEnabled: true });
    });

    it('updateReminderTime index=-1でもクラッシュしない', async () => {
      useSettingsStore.setState({
        settings: {
          reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      await expect(
        useSettingsStore.getState().updateReminderTime(-1, { hour: 10, minute: 0, isEnabled: true })
      ).resolves.not.toThrow();
    });

    it('removeReminderTime index=-1でも元の配列が保持される', async () => {
      const originalTimes = [{ hour: 7, minute: 0, isEnabled: true }];
      useSettingsStore.setState({
        settings: {
          reminderTimes: originalTimes,
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().removeReminderTime(-1);

      expect(useSettingsStore.getState().settings.reminderTimes).toHaveLength(1);
      expect(useSettingsStore.getState().settings.reminderTimes[0].hour).toBe(7);
    });

    it('toggleReminderTime index=999でも全要素に変更がない', async () => {
      const originalTimes = [
        { hour: 7, minute: 0, isEnabled: true },
        { hour: 21, minute: 0, isEnabled: false },
      ];
      useSettingsStore.setState({
        settings: {
          reminderTimes: originalTimes,
          isDarkMode: false,
          notificationsEnabled: true,
        },
      });
      mockStorageService.saveSettings.mockResolvedValue();

      await useSettingsStore.getState().toggleReminderTime(999);

      const times = useSettingsStore.getState().settings.reminderTimes;
      expect(times[0].isEnabled).toBe(true);
      expect(times[1].isEnabled).toBe(false);
    });
  });
});
