/**
 * ストレージサービスのテスト
 *
 * TDD: RED phase
 * - AsyncStorageをラップした汎用ストレージサービス
 * - 型安全なget/set/remove/clear操作
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, StorageKeys } from '../../src/services/storage';
import { DiaryEntry, Question, Settings } from '../../src/types';

// AsyncStorageをモック
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed JSON data for existing key', async () => {
      const mockData = { id: '1', name: 'test' };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockData));

      const result = await StorageService.get<typeof mockData>('test_key');

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test_key');
      expect(result).toEqual(mockData);
    });

    it('should return null for non-existing key', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.get('non_existing');

      expect(result).toBeNull();
    });

    it('should return null and log error on parse failure', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await StorageService.get('bad_json');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should stringify and store data', async () => {
      const data = { id: '1', value: 'test' };
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.set('test_key', data);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'test_key',
        JSON.stringify(data)
      );
    });

    it('should handle storage errors', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage full'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(StorageService.set('key', {})).rejects.toThrow('Storage full');
      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should remove item by key', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await StorageService.remove('test_key');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test_key');
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      mockAsyncStorage.clear.mockResolvedValue();

      await StorageService.clear();

      expect(mockAsyncStorage.clear).toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('some value');

      const result = await StorageService.exists('test_key');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.exists('non_existing');

      expect(result).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all storage keys', async () => {
      const keys = ['key1', 'key2', 'key3'];
      mockAsyncStorage.getAllKeys.mockResolvedValue(keys);

      const result = await StorageService.getAllKeys();

      expect(result).toEqual(keys);
    });
  });
});

describe('StorageKeys', () => {
  it('should have DIARY_ENTRIES key', () => {
    expect(StorageKeys.DIARY_ENTRIES).toBe('diary_entries');
  });

  it('should have QUESTIONS key', () => {
    expect(StorageKeys.QUESTIONS).toBe('questions');
  });

  it('should have SETTINGS key', () => {
    expect(StorageKeys.SETTINGS).toBe('settings');
  });
});

describe('Domain-specific storage operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDiaryEntries', () => {
    it('should return empty array if no entries exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getDiaryEntries();

      expect(result).toEqual([]);
    });

    it('should return parsed diary entries', async () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-13',
          createdAt: '2024-01-13T21:00:00Z',
          updatedAt: '2024-01-13T21:00:00Z',
          answers: [],
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(entries));

      const result = await StorageService.getDiaryEntries();

      expect(result).toEqual(entries);
    });
  });

  describe('saveDiaryEntry', () => {
    it('should add new entry to existing entries', async () => {
      const existingEntries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-12',
          createdAt: '2024-01-12T21:00:00Z',
          updatedAt: '2024-01-12T21:00:00Z',
          answers: [],
        },
      ];
      const newEntry: DiaryEntry = {
        id: '2',
        date: '2024-01-13',
        createdAt: '2024-01-13T21:00:00Z',
        updatedAt: '2024-01-13T21:00:00Z',
        answers: [],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingEntries));
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveDiaryEntry(newEntry);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.DIARY_ENTRIES,
        JSON.stringify([...existingEntries, newEntry])
      );
    });

    it('should update existing entry if id matches', async () => {
      const existingEntries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-13',
          createdAt: '2024-01-13T21:00:00Z',
          updatedAt: '2024-01-13T21:00:00Z',
          answers: [],
        },
      ];
      const updatedEntry: DiaryEntry = {
        id: '1',
        date: '2024-01-13',
        createdAt: '2024-01-13T21:00:00Z',
        updatedAt: '2024-01-13T22:00:00Z',
        answers: [{ questionId: 'q1', questionText: 'Q', value: 'A', type: 'text' }],
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingEntries));
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveDiaryEntry(updatedEntry);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.DIARY_ENTRIES,
        JSON.stringify([updatedEntry])
      );
    });
  });

  describe('deleteDiaryEntry', () => {
    it('should remove entry by id', async () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-12',
          createdAt: '2024-01-12T21:00:00Z',
          updatedAt: '2024-01-12T21:00:00Z',
          answers: [],
        },
        {
          id: '2',
          date: '2024-01-13',
          createdAt: '2024-01-13T21:00:00Z',
          updatedAt: '2024-01-13T21:00:00Z',
          answers: [],
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(entries));
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.deleteDiaryEntry('1');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.DIARY_ENTRIES,
        JSON.stringify([entries[1]])
      );
    });
  });

  describe('getQuestions', () => {
    it('should return empty array if no questions exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getQuestions();

      expect(result).toEqual([]);
    });
  });

  describe('saveQuestions', () => {
    it('should save questions array', async () => {
      const questions: Question[] = [
        { id: '1', text: 'Q1', type: 'text', order: 1, isActive: true },
      ];
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveQuestions(questions);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.QUESTIONS,
        JSON.stringify(questions)
      );
    });
  });

  describe('getSettings', () => {
    it('should return default settings if none exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await StorageService.getSettings();

      expect(result).toEqual({
        reminderTimes: [],
        isDarkMode: false,
        notificationsEnabled: true,
      });
    });
  });

  describe('saveSettings', () => {
    it('should save settings', async () => {
      const settings: Settings = {
        reminderTimes: [{ hour: 21, minute: 0, isEnabled: true }],
        isDarkMode: true,
        notificationsEnabled: true,
      };
      mockAsyncStorage.setItem.mockResolvedValue();

      await StorageService.saveSettings(settings);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.SETTINGS,
        JSON.stringify(settings)
      );
    });
  });
});
