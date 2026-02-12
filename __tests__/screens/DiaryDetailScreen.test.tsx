/**
 * DiaryDetailScreen テスト
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DiaryDetailScreen } from '../../src/screens/DiaryDetailScreen';
import { useDiaryStore } from '../../src/stores/diaryStore';
import { DiaryEntry } from '../../src/types';

// モック
jest.mock('../../src/stores/diaryStore');

const mockGoBack = jest.fn();
const mockUseRoute = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => mockUseRoute(),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const mockUseDiaryStore = useDiaryStore as jest.MockedFunction<
  typeof useDiaryStore
>;

describe('DiaryDetailScreen', () => {
  const mockUpdateEntry = jest.fn();
  const mockDeleteEntry = jest.fn();
  const mockGetEntryById = jest.fn();

  const mockEntry: DiaryEntry = {
    id: 'entry-1',
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
      {
        questionId: 'q2',
        questionText: '今日あった良いことは？',
        value: '素晴らしい一日でした',
        type: 'text',
      },
      {
        questionId: 'q3',
        questionText: '今日学んだことは？',
        value: 'TDDの重要性',
        type: 'text',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: { entryId: 'entry-1' },
    });
    mockUseDiaryStore.mockReturnValue({
      entries: [mockEntry],
      isLoading: false,
      error: null,
      loadEntries: jest.fn(),
      addEntry: jest.fn(),
      updateEntry: mockUpdateEntry,
      deleteEntry: mockDeleteEntry,
      getEntryByDate: jest.fn(),
      getEntryById: mockGetEntryById,
      addAnswerToEntry: jest.fn(),
      clearError: jest.fn(),
    });
    mockGetEntryById.mockReturnValue(mockEntry);
  });

  describe('仕様検証', () => {
    it('日付が表示される', () => {
      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('2026-01-25')).toBeTruthy();
    });

    it('全ての回答が表示される', () => {
      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('今日の気分は？')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('今日あった良いことは？')).toBeTruthy();
      expect(getByText('素晴らしい一日でした')).toBeTruthy();
      expect(getByText('今日学んだことは？')).toBeTruthy();
      expect(getByText('TDDの重要性')).toBeTruthy();
    });

    it('編集ボタンが表示される', () => {
      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('編集')).toBeTruthy();
    });

    it('削除ボタンが表示される', () => {
      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('削除')).toBeTruthy();
    });
  });

  describe('編集モード', () => {
    it('編集ボタンをタップすると編集モードに切り替わる', () => {
      const { getByText } = render(<DiaryDetailScreen />);

      const editButton = getByText('編集');
      fireEvent.press(editButton);

      // 保存とキャンセルボタンが表示される
      expect(getByText('保存')).toBeTruthy();
      expect(getByText('キャンセル')).toBeTruthy();
    });

    it('編集モードではテキスト回答を編集できる', () => {
      const { getByText, getByDisplayValue } = render(
        <DiaryDetailScreen />
      );

      fireEvent.press(getByText('編集'));

      const input = getByDisplayValue('素晴らしい一日でした');
      fireEvent.changeText(input, '更新された回答');

      expect(input.props.value).toBe('更新された回答');
    });

    it('保存ボタンをタップするとupdateEntryが呼ばれる', async () => {
      const { getByText } = render(<DiaryDetailScreen />);

      fireEvent.press(getByText('編集'));
      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledTimes(1);
      });
    });

    it('キャンセルボタンをタップすると編集がキャンセルされる', () => {
      const { getByText, queryByText } = render(
        <DiaryDetailScreen />
      );

      fireEvent.press(getByText('編集'));
      expect(getByText('保存')).toBeTruthy();

      fireEvent.press(getByText('キャンセル'));

      // 編集ボタンに戻る
      expect(getByText('編集')).toBeTruthy();
      expect(queryByText('保存')).toBeNull();
    });

    it('updateEntryが失敗してもクラッシュしない', async () => {
      mockUpdateEntry.mockRejectedValue(new Error('Update failed'));

      const { getByText, getByDisplayValue } = render(
        <DiaryDetailScreen />
      );

      fireEvent.press(getByText('編集'));
      const input = getByDisplayValue('素晴らしい一日でした');
      fireEvent.changeText(input, '更新された回答');

      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalled();
      });

      // エラーがキャッチされ、クラッシュせずに編集モードが維持される
      expect(getByText('保存')).toBeTruthy();
    });

    it('保存ボタンを連続でタップしてもupdateEntryは1回だけ呼ばれる', async () => {
      const { getByText } = render(<DiaryDetailScreen />);

      fireEvent.press(getByText('編集'));
      const saveButton = getByText('保存');
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('削除機能', () => {
    it('削除ボタンをタップするとdeleteEntryが呼ばれる', async () => {
      const { getByText } = render(<DiaryDetailScreen />);

      const deleteButton = getByText('削除');
      fireEvent.press(deleteButton);

      await waitFor(() => {
        expect(mockDeleteEntry).toHaveBeenCalledWith('entry-1');
      });
    });

    it('削除成功後にnavigation.goBack()が呼ばれる', async () => {
      mockDeleteEntry.mockResolvedValue(undefined);

      const { getByText } = render(<DiaryDetailScreen />);

      fireEvent.press(getByText('削除'));

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalledTimes(1);
      });
    });

    it('deleteEntryが失敗してもクラッシュしない', async () => {
      mockDeleteEntry.mockRejectedValue(new Error('Delete failed'));

      const { getByText } = render(<DiaryDetailScreen />);

      fireEvent.press(getByText('削除'));

      await waitFor(() => {
        expect(mockDeleteEntry).toHaveBeenCalled();
      });

      // エラーがキャッチされ、クラッシュせずに画面が維持される
      expect(getByText('削除')).toBeTruthy();
    });

    it('deleteEntryが失敗した場合goBackは呼ばれない', async () => {
      mockDeleteEntry.mockRejectedValue(new Error('Delete failed'));

      const { getByText } = render(<DiaryDetailScreen />);

      fireEvent.press(getByText('削除'));

      await waitFor(() => {
        expect(mockDeleteEntry).toHaveBeenCalled();
      });

      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('削除ボタンを連続でタップしてもdeleteEntryは1回だけ呼ばれる', async () => {
      const { getByText } = render(<DiaryDetailScreen />);

      const deleteButton = getByText('削除');
      fireEvent.press(deleteButton);
      fireEvent.press(deleteButton);
      fireEvent.press(deleteButton);

      await waitFor(() => {
        expect(mockDeleteEntry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('エラー状態', () => {
    it('エントリーが見つからない場合、エラーメッセージが表示される', () => {
      mockGetEntryById.mockReturnValue(undefined);

      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('日記が見つかりません')).toBeTruthy();
    });

    it('entryIdが未指定の場合、エラーメッセージが表示される', () => {
      mockUseRoute.mockReturnValue({
        params: { entryId: undefined },
      });

      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('日記が見つかりません')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('画面全体にaccessibilityRole="none"が設定される', () => {
      const { getByTestId } = render(<DiaryDetailScreen />);
      expect(getByTestId('diary-detail-screen')).toHaveProp(
        'accessibilityRole',
        'none'
      );
    });

    it('日付にaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<DiaryDetailScreen />);
      const date = getByText('2026-01-25');
      expect(date.props.accessibilityRole).toBe('header');
    });
  });

  describe('エッジケース', () => {
    it('回答が空のエントリーでも正常に表示できる', () => {
      const emptyEntry: DiaryEntry = {
        ...mockEntry,
        answers: [],
      };
      mockGetEntryById.mockReturnValue(emptyEntry);

      expect(() => {
        render(<DiaryDetailScreen />);
      }).not.toThrow();
    });

    it('非常に長い回答（1000文字）でも正常に表示できる', () => {
      const longEntry: DiaryEntry = {
        ...mockEntry,
        answers: [
          {
            questionId: 'q1',
            questionText: '質問',
            value: 'A'.repeat(1000),
            type: 'text',
          },
        ],
      };
      mockGetEntryById.mockReturnValue(longEntry);

      expect(() => {
        render(<DiaryDetailScreen />);
      }).not.toThrow();
    });

    it('編集中にキャンセルすると変更が破棄される', () => {
      const { getByText, getByDisplayValue } = render(
        <DiaryDetailScreen />
      );

      fireEvent.press(getByText('編集'));

      const input = getByDisplayValue('素晴らしい一日でした');
      fireEvent.changeText(input, '変更された内容');

      fireEvent.press(getByText('キャンセル'));

      // 編集モード終了後、元の値が表示される
      expect(getByText('素晴らしい一日でした')).toBeTruthy();
    });

    it('未知のanswer.typeの回答でも正常に表示できる', () => {
      const unknownTypeEntry: DiaryEntry = {
        ...mockEntry,
        answers: [
          {
            questionId: 'q1',
            questionText: '質問',
            value: 'テスト回答',
            type: 'unknown' as any,
          },
        ],
      };
      mockGetEntryById.mockReturnValue(unknownTypeEntry);

      expect(() => {
        render(<DiaryDetailScreen />);
      }).not.toThrow();

      const { getByText } = render(<DiaryDetailScreen />);
      expect(getByText('テスト回答')).toBeTruthy();
    });

    it('answer.valueがundefinedの場合でもクラッシュしない', () => {
      const undefinedValueEntry: DiaryEntry = {
        ...mockEntry,
        answers: [
          {
            questionId: 'q1',
            questionText: '質問',
            value: undefined as any,
            type: 'text',
          },
        ],
      };
      mockGetEntryById.mockReturnValue(undefinedValueEntry);

      expect(() => {
        render(<DiaryDetailScreen />);
      }).not.toThrow();
    });
  });
});
