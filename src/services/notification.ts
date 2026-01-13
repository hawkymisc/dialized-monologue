/**
 * 通知サービス
 *
 * expo-notificationsを使ったリマインダー通知の管理
 */

import * as Notifications from 'expo-notifications';
import { ReminderTime } from '../types';

// 通知ハンドラーの設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * 通知サービス
 */
export const NotificationService = {
  /**
   * 通知権限をリクエスト
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    if (existingStatus === 'denied') {
      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  /**
   * リマインダーをスケジュール
   */
  async scheduleReminder(time: ReminderTime): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '日記の時間です',
        body: '今日を振り返りましょう',
        data: { type: 'reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      },
    });
    return id;
  },

  /**
   * リマインダーをキャンセル
   */
  async cancelReminder(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
  },

  /**
   * 全てのリマインダーをキャンセル
   */
  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * 複数のリマインダーをスケジュール
   */
  async scheduleMultipleReminders(times: ReminderTime[]): Promise<string[]> {
    const enabledTimes = times.filter((t) => t.isEnabled);
    const ids: string[] = [];

    for (const time of enabledTimes) {
      const id = await this.scheduleReminder(time);
      ids.push(id);
    }

    return ids;
  },

  /**
   * スケジュール済みのリマインダーを取得
   */
  async getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  },

  /**
   * リマインダーを更新（全キャンセル→再スケジュール）
   */
  async updateReminders(times: ReminderTime[]): Promise<string[]> {
    await this.cancelAllReminders();
    return await this.scheduleMultipleReminders(times);
  },
};
