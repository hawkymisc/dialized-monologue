/**
 * HomeScreen テスト
 */
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../../src/screens/HomeScreen';
import { useDiaryStore } from '../../src/stores/diaryStore';
import { DiaryEntry } from '../../src/types';

// モック
jest.mock('../../src/stores/diaryStore');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockUseDiaryStore = useDiaryStore as jest.MockedFunction<
  typeof useDiaryStore
>;

describe('HomeScreen', () => {
  const mockLoadEntries = jest.fn();
  const mockGetEntryByDate = jest.fn();

  const mockEntries: DiaryEntry[] = [
    {
      id: '1',
      date: '2026-01-25',
      createdAt: '2026-01-25T10:00:00Z',
      updatedAt: '2026-01-25T10:00:00Z',
      answers: [
        {
          questionId: 'q1',
          questionText: '今日の気分は？',
          value: 5,
          type: 'rating',
        },
      ],
    },
    {
      id: '2',
      date: '2026-01-24',
      createdAt: '2026-01-24T10:00:00Z',
      updatedAt: '2026-01-24T10:00:00Z',
      answers: [
        {
          questionId: 'q1',
          questionText: '今日の気分は？',
          value: 4,
          type: 'rating',
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDiaryStore.mockReturnValue({
      entries: [],
      isLoading: false,
      error: null,
      loadEntries: mockLoadEntries,
      getEntryByDate: mockGetEntryByDate,
      addEntry: jest.fn(),
      updateEntry: jest.fn(),
      deleteEntry: jest.fn(),
      getEntryById: jest.fn(),
      addAnswerToEntry: jest.fn(),
      clearError: jest.fn(),
    });
  });

  describe('仕様検証', () => {
    it('画面タイトルが表示される', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('日記')).toBeTruthy();
    });

    it('初回マウント時にloadEntriesが呼ばれる', async () => {
      render(<HomeScreen />);
      await waitFor(() => {
        expect(mockLoadEntries).toHaveBeenCalledTimes(1);
      });
    });

    it('今日の日記セクションが表示される', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('今日の日記')).toBeTruthy();
    });

    it('過去の日記セクションが表示される', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('過去の日記')).toBeTruthy();
    });
  });

  describe('今日の日記', () => {
    it('今日の日記が存在しない場合、「日記を書く」ボタンが表示される', () => {
      mockGetEntryByDate.mockReturnValue(undefined);
      const { getByText } = render(<HomeScreen />);
      expect(getByText('日記を書く')).toBeTruthy();
    });

    it('今日の日記が存在する場合、「今日の日記を見る」ボタンが表示される', () => {
      const today = new Date().toISOString().split('T')[0];
      const todayEntry: DiaryEntry = {
        id: 'today',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: [],
      };
      mockGetEntryByDate.mockReturnValue(todayEntry);

      const { getByText } = render(<HomeScreen />);
      expect(getByText('今日の日記を見る')).toBeTruthy();
    });
  });

  describe('過去の日記一覧', () => {
    it('日記エントリーがない場合、「まだ日記がありません」が表示される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: [],
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText } = render(<HomeScreen />);
      expect(getByText('まだ日記がありません')).toBeTruthy();
    });

    it('日記エントリーがある場合、一覧が表示される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: mockEntries,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText } = render(<HomeScreen />);
      expect(getByText('2026-01-25')).toBeTruthy();
      expect(getByText('2026-01-24')).toBeTruthy();
    });

    it('日記エントリーは日付降順で表示される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: mockEntries,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getAllByTestId } = render(<HomeScreen />);
      const items = getAllByTestId(/diary-item-/);
      expect(items).toHaveLength(2);
      // 最初のアイテムが新しい日付
      expect(items[0]).toHaveProp('testID', 'diary-item-1');
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中は「読み込み中...」が表示される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: [],
        isLoading: true,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText } = render(<HomeScreen />);
      expect(getByText('読み込み中...')).toBeTruthy();
    });
  });

  describe('エラー状態', () => {
    it('エラーがある場合、エラーメッセージが表示される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: [],
        isLoading: false,
        error: 'データの読み込みに失敗しました',
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText } = render(<HomeScreen />);
      expect(getByText('エラー: データの読み込みに失敗しました')).toBeTruthy();
    });

    it('loadEntriesが例外をスローした場合でもクラッシュしない', async () => {
      mockLoadEntries.mockRejectedValue(new Error('Network error'));

      expect(() => {
        render(<HomeScreen />);
      }).not.toThrow();
    });

    it('非常に長いエラーメッセージでも表示できる', () => {
      const longError = 'A'.repeat(1000);
      mockUseDiaryStore.mockReturnValue({
        entries: [],
        isLoading: false,
        error: longError,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText } = render(<HomeScreen />);
      expect(getByText(`エラー: ${longError}`)).toBeTruthy();
    });

    it('isLoading=trueかつerrorが設定されている場合、ローディングが優先される', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: [],
        isLoading: true,
        error: 'エラーメッセージ',
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByText, queryByText } = render(<HomeScreen />);
      expect(getByText('読み込み中...')).toBeTruthy();
      expect(queryByText('エラー:')).toBeNull();
    });
  });

  describe('ナビゲーション', () => {
    it('「日記を書く」タップでDiaryInput画面に遷移する', () => {
      mockGetEntryByDate.mockReturnValue(undefined);
      const { getByText } = render(<HomeScreen />);

      fireEvent.press(getByText('日記を書く'));
      expect(mockNavigate).toHaveBeenCalledWith('DiaryInput');
    });

    it('「今日の日記を見る」タップでDiaryDetail画面に遷移する', () => {
      const today = new Date().toISOString().split('T')[0];
      const todayEntry: DiaryEntry = {
        id: 'today-entry',
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: [],
      };
      mockGetEntryByDate.mockReturnValue(todayEntry);

      const { getByText } = render(<HomeScreen />);

      fireEvent.press(getByText('今日の日記を見る'));
      expect(mockNavigate).toHaveBeenCalledWith('DiaryDetail', {
        entryId: 'today-entry',
      });
    });

    it('設定ボタンタップでSettings画面に遷移する', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('settings-button'));
      expect(mockNavigate).toHaveBeenCalledWith('Settings');
    });

    it('ListItemタップでDiaryDetail画面に遷移する', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: mockEntries,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('diary-item-1'));
      expect(mockNavigate).toHaveBeenCalledWith('DiaryDetail', {
        entryId: '1',
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('画面全体にaccessibilityRole="none"が設定される', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('home-screen')).toHaveProp('accessibilityRole', 'none');
    });

    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<HomeScreen />);
      const title = getByText('日記');
      expect(title.props.accessibilityRole).toBe('header');
    });
  });

  describe('エッジケース', () => {
    it('entriesがundefinedでもクラッシュしない', () => {
      mockUseDiaryStore.mockReturnValue({
        entries: undefined as any,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      expect(() => {
        render(<HomeScreen />);
      }).not.toThrow();
    });

    it('非常に多くのエントリー（100件）でも正常にレンダリングできる', () => {
      const manyEntries: DiaryEntry[] = Array.from({ length: 100 }, (_, i) => ({
        id: `entry-${i}`,
        date: `2026-01-${String(i + 1).padStart(2, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: [],
      }));

      mockUseDiaryStore.mockReturnValue({
        entries: manyEntries,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      expect(() => {
        render(<HomeScreen />);
      }).not.toThrow();
    });

    it('不正な日付形式のエントリーがあってもクラッシュしない', () => {
      const invalidDateEntry: DiaryEntry = {
        id: 'invalid',
        date: 'invalid-date',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        answers: [],
      };

      mockUseDiaryStore.mockReturnValue({
        entries: [invalidDateEntry],
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      expect(() => {
        render(<HomeScreen />);
      }).not.toThrow();
    });

    it('同じ日付の重複エントリーがあっても正常に表示される', () => {
      const duplicateEntries: DiaryEntry[] = [
        {
          id: '1',
          date: '2026-01-25',
          createdAt: '2026-01-25T10:00:00Z',
          updatedAt: '2026-01-25T10:00:00Z',
          answers: [],
        },
        {
          id: '2',
          date: '2026-01-25',
          createdAt: '2026-01-25T11:00:00Z',
          updatedAt: '2026-01-25T11:00:00Z',
          answers: [],
        },
      ];

      mockUseDiaryStore.mockReturnValue({
        entries: duplicateEntries,
        isLoading: false,
        error: null,
        loadEntries: mockLoadEntries,
        getEntryByDate: mockGetEntryByDate,
        addEntry: jest.fn(),
        updateEntry: jest.fn(),
        deleteEntry: jest.fn(),
        getEntryById: jest.fn(),
        addAnswerToEntry: jest.fn(),
        clearError: jest.fn(),
      });

      const { getAllByText } = render(<HomeScreen />);
      const dateElements = getAllByText('2026-01-25');
      expect(dateElements).toHaveLength(2);
    });
  });
});
