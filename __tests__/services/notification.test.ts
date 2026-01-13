/**
 * 通知サービスのテスト
 *
 * TDD: RED -> GREEN -> REFACTOR
 */

import * as Notifications from 'expo-notifications';
import { NotificationService } from '../../src/services/notification';
import { ReminderTime } from '../../src/types';

// expo-notificationsをモック
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    DAILY: 'daily',
  },
}));

const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should return true if permissions already granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted' as any,
        expires: 'never',
        granted: true,
        canAskAgain: true,
      } as any);

      const result = await NotificationService.requestPermissions();

      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should request permissions if not granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'undetermined' as any,
        expires: 'never',
        granted: false,
        canAskAgain: true,
      } as any);
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'granted' as any,
        expires: 'never',
        granted: true,
        canAskAgain: true,
      } as any);

      const result = await NotificationService.requestPermissions();

      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false if permissions denied', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'denied' as any,
        expires: 'never',
        granted: false,
        canAskAgain: false,
      } as any);

      const result = await NotificationService.requestPermissions();

      expect(result).toBe(false);
    });
  });

  describe('scheduleReminder', () => {
    it('should schedule daily notification', async () => {
      mockNotifications.scheduleNotificationAsync.mockResolvedValue('notification-id');

      const time: ReminderTime = { hour: 21, minute: 0, isEnabled: true };
      const id = await NotificationService.scheduleReminder(time);

      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: '日記の時間です',
          body: '今日を振り返りましょう',
          data: { type: 'reminder' },
        },
        trigger: {
          type: 'daily',
          hour: 21,
          minute: 0,
        },
      });
      expect(id).toBe('notification-id');
    });
  });

  describe('cancelReminder', () => {
    it('should cancel scheduled notification by id', async () => {
      mockNotifications.cancelScheduledNotificationAsync.mockResolvedValue();

      await NotificationService.cancelReminder('notification-id');

      expect(mockNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'notification-id'
      );
    });
  });

  describe('cancelAllReminders', () => {
    it('should cancel all scheduled notifications', async () => {
      mockNotifications.cancelAllScheduledNotificationsAsync.mockResolvedValue();

      await NotificationService.cancelAllReminders();

      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('scheduleMultipleReminders', () => {
    it('should schedule multiple reminders', async () => {
      mockNotifications.scheduleNotificationAsync
        .mockResolvedValueOnce('id-1')
        .mockResolvedValueOnce('id-2');

      const times: ReminderTime[] = [
        { hour: 7, minute: 0, isEnabled: true },
        { hour: 21, minute: 0, isEnabled: true },
      ];
      const ids = await NotificationService.scheduleMultipleReminders(times);

      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
      expect(ids).toEqual(['id-1', 'id-2']);
    });

    it('should skip disabled reminders', async () => {
      mockNotifications.scheduleNotificationAsync.mockResolvedValue('id-1');

      const times: ReminderTime[] = [
        { hour: 7, minute: 0, isEnabled: true },
        { hour: 21, minute: 0, isEnabled: false },
      ];
      const ids = await NotificationService.scheduleMultipleReminders(times);

      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
      expect(ids).toEqual(['id-1']);
    });
  });

  describe('getScheduledReminders', () => {
    it('should return all scheduled notifications', async () => {
      const mockScheduled = [
        { identifier: 'id-1', content: {}, trigger: {} },
        { identifier: 'id-2', content: {}, trigger: {} },
      ];
      mockNotifications.getAllScheduledNotificationsAsync.mockResolvedValue(
        mockScheduled as any
      );

      const result = await NotificationService.getScheduledReminders();

      expect(result).toEqual(mockScheduled);
    });
  });

  describe('updateReminders', () => {
    it('should cancel all and reschedule reminders', async () => {
      mockNotifications.cancelAllScheduledNotificationsAsync.mockResolvedValue();
      mockNotifications.scheduleNotificationAsync
        .mockResolvedValueOnce('new-id-1')
        .mockResolvedValueOnce('new-id-2');

      const times: ReminderTime[] = [
        { hour: 7, minute: 0, isEnabled: true },
        { hour: 21, minute: 0, isEnabled: true },
      ];
      const ids = await NotificationService.updateReminders(times);

      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(ids).toEqual(['new-id-1', 'new-id-2']);
    });
  });
});
