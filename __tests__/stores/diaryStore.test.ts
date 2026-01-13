/**
 * 日記ストアのテスト
 *
 * TDD: RED -> GREEN -> REFACTOR
 * - Zustandによる日記の状態管理
 * - CRUD操作、ストレージとの同期
 */

import { useDiaryStore } from '../../src/stores/diaryStore';
import { StorageService } from '../../src/services/storage';
import { DiaryEntry, DiaryAnswer, createDiaryEntry } from '../../src/types';

// StorageServiceをモック
jest.mock('../../src/services/storage', () => ({
  StorageService: {
    getDiaryEntries: jest.fn(),
    saveDiaryEntry: jest.fn(),
    deleteDiaryEntry: jest.fn(),
  },
}));

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('useDiaryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ストアの状態をリセット
    useDiaryStore.setState({
      entries: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty entries array', () => {
      const state = useDiaryStore.getState();
      expect(state.entries).toEqual([]);
    });

    it('should not be loading initially', () => {
      const state = useDiaryStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should have no error initially', () => {
      const state = useDiaryStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('loadEntries', () => {
    it('should load entries from storage', async () => {
      const mockEntries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-13',
          createdAt: '2024-01-13T21:00:00Z',
          updatedAt: '2024-01-13T21:00:00Z',
          answers: [],
        },
      ];
      mockStorageService.getDiaryEntries.mockResolvedValue(mockEntries);

      await useDiaryStore.getState().loadEntries();

      expect(useDiaryStore.getState().entries).toEqual(mockEntries);
      expect(useDiaryStore.getState().isLoading).toBe(false);
    });

    it('should set loading state during load', () => {
      mockStorageService.getDiaryEntries.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      useDiaryStore.getState().loadEntries();

      expect(useDiaryStore.getState().isLoading).toBe(true);
    });

    it('should handle load error', async () => {
      mockStorageService.getDiaryEntries.mockRejectedValue(new Error('Load failed'));

      await useDiaryStore.getState().loadEntries();

      expect(useDiaryStore.getState().error).toBe('Load failed');
      expect(useDiaryStore.getState().isLoading).toBe(false);
    });
  });

  describe('addEntry', () => {
    it('should add new entry', async () => {
      mockStorageService.saveDiaryEntry.mockResolvedValue();
      const newEntry = createDiaryEntry('2024-01-13');

      await useDiaryStore.getState().addEntry(newEntry);

      expect(useDiaryStore.getState().entries).toContainEqual(newEntry);
      expect(mockStorageService.saveDiaryEntry).toHaveBeenCalledWith(newEntry);
    });
  });

  describe('updateEntry', () => {
    it('should update existing entry', async () => {
      const existingEntry: DiaryEntry = {
        id: '1',
        date: '2024-01-13',
        createdAt: '2024-01-13T21:00:00Z',
        updatedAt: '2024-01-13T21:00:00Z',
        answers: [],
      };
      useDiaryStore.setState({ entries: [existingEntry] });
      mockStorageService.saveDiaryEntry.mockResolvedValue();

      const updatedEntry: DiaryEntry = {
        ...existingEntry,
        updatedAt: '2024-01-13T22:00:00Z',
        answers: [{ questionId: 'q1', questionText: 'Q', value: 'A', type: 'text' }],
      };

      await useDiaryStore.getState().updateEntry(updatedEntry);

      expect(useDiaryStore.getState().entries[0].answers).toHaveLength(1);
      expect(mockStorageService.saveDiaryEntry).toHaveBeenCalledWith(updatedEntry);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry by id', async () => {
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
      useDiaryStore.setState({ entries });
      mockStorageService.deleteDiaryEntry.mockResolvedValue();

      await useDiaryStore.getState().deleteEntry('1');

      expect(useDiaryStore.getState().entries).toHaveLength(1);
      expect(useDiaryStore.getState().entries[0].id).toBe('2');
      expect(mockStorageService.deleteDiaryEntry).toHaveBeenCalledWith('1');
    });
  });

  describe('getEntryByDate', () => {
    it('should return entry for given date', () => {
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
      useDiaryStore.setState({ entries });

      const entry = useDiaryStore.getState().getEntryByDate('2024-01-13');

      expect(entry?.id).toBe('2');
    });

    it('should return undefined for non-existing date', () => {
      useDiaryStore.setState({ entries: [] });

      const entry = useDiaryStore.getState().getEntryByDate('2024-01-13');

      expect(entry).toBeUndefined();
    });
  });

  describe('getEntryById', () => {
    it('should return entry for given id', () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-13',
          createdAt: '2024-01-13T21:00:00Z',
          updatedAt: '2024-01-13T21:00:00Z',
          answers: [],
        },
      ];
      useDiaryStore.setState({ entries });

      const entry = useDiaryStore.getState().getEntryById('1');

      expect(entry?.date).toBe('2024-01-13');
    });
  });

  describe('addAnswerToEntry', () => {
    it('should add answer to existing entry', async () => {
      const entry: DiaryEntry = {
        id: '1',
        date: '2024-01-13',
        createdAt: '2024-01-13T21:00:00Z',
        updatedAt: '2024-01-13T21:00:00Z',
        answers: [],
      };
      useDiaryStore.setState({ entries: [entry] });
      mockStorageService.saveDiaryEntry.mockResolvedValue();

      const answer: DiaryAnswer = {
        questionId: 'q1',
        questionText: '今日の気分は？',
        value: '良い',
        type: 'text',
      };

      await useDiaryStore.getState().addAnswerToEntry('1', answer);

      expect(useDiaryStore.getState().entries[0].answers).toContainEqual(answer);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useDiaryStore.setState({ error: 'Some error' });

      useDiaryStore.getState().clearError();

      expect(useDiaryStore.getState().error).toBeNull();
    });
  });
});
