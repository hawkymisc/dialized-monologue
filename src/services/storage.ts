/**
 * ストレージサービス
 *
 * AsyncStorageをラップした型安全なストレージ操作を提供
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry, Question, Settings } from '../types';

/**
 * ストレージキー定数
 */
export const StorageKeys = {
  DIARY_ENTRIES: 'diary_entries',
  QUESTIONS: 'questions',
  SETTINGS: 'settings',
} as const;

/**
 * デフォルト設定
 */
const DEFAULT_SETTINGS: Settings = {
  reminderTimes: [],
  isDarkMode: false,
  notificationsEnabled: true,
};

/**
 * ストレージサービス
 */
export const StorageService = {
  /**
   * データを取得
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`StorageService.get error for key "${key}":`, error);
      return null;
    }
  },

  /**
   * データを保存
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`StorageService.set error for key "${key}":`, error);
      throw error;
    }
  },

  /**
   * データを削除
   */
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * 全データをクリア
   */
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },

  /**
   * キーが存在するか確認
   */
  async exists(key: string): Promise<boolean> {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  },

  /**
   * 全キーを取得
   */
  async getAllKeys(): Promise<readonly string[]> {
    return await AsyncStorage.getAllKeys();
  },

  // ========================================
  // ドメイン固有の操作
  // ========================================

  /**
   * 日記エントリーを全て取得
   */
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    const entries = await this.get<DiaryEntry[]>(StorageKeys.DIARY_ENTRIES);
    return entries ?? [];
  },

  /**
   * 日記エントリーを保存（新規または更新）
   */
  async saveDiaryEntry(entry: DiaryEntry): Promise<void> {
    const entries = await this.getDiaryEntries();
    const index = entries.findIndex((e) => e.id === entry.id);

    if (index >= 0) {
      // 既存エントリーを更新
      entries[index] = entry;
    } else {
      // 新規エントリーを追加
      entries.push(entry);
    }

    await this.set(StorageKeys.DIARY_ENTRIES, entries);
  },

  /**
   * 日記エントリーを削除
   */
  async deleteDiaryEntry(id: string): Promise<void> {
    const entries = await this.getDiaryEntries();
    const filtered = entries.filter((e) => e.id !== id);
    await this.set(StorageKeys.DIARY_ENTRIES, filtered);
  },

  /**
   * 質問を全て取得
   */
  async getQuestions(): Promise<Question[]> {
    const questions = await this.get<Question[]>(StorageKeys.QUESTIONS);
    return questions ?? [];
  },

  /**
   * 質問を保存
   */
  async saveQuestions(questions: Question[]): Promise<void> {
    await this.set(StorageKeys.QUESTIONS, questions);
  },

  /**
   * 設定を取得
   */
  async getSettings(): Promise<Settings> {
    const settings = await this.get<Settings>(StorageKeys.SETTINGS);
    return settings ?? DEFAULT_SETTINGS;
  },

  /**
   * 設定を保存
   */
  async saveSettings(settings: Settings): Promise<void> {
    await this.set(StorageKeys.SETTINGS, settings);
  },
};
