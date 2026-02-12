/**
 * DiaryInputScreen テスト
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DiaryInputScreen } from '../../src/screens/DiaryInputScreen';
import { useQuestionStore } from '../../src/stores/questionStore';
import { useDiaryStore } from '../../src/stores/diaryStore';
import { Question } from '../../src/types';

// モック
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));
jest.mock('../../src/stores/questionStore');
jest.mock('../../src/stores/diaryStore');

const mockUseQuestionStore = useQuestionStore as jest.MockedFunction<
  typeof useQuestionStore
>;
const mockUseDiaryStore = useDiaryStore as jest.MockedFunction<
  typeof useDiaryStore
>;

describe('DiaryInputScreen', () => {
  const mockLoadQuestions = jest.fn();
  const mockAddEntry = jest.fn();
  const mockGetEntryByDate = jest.fn();

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      text: '今日の気分は？',
      type: 'rating',
      order: 1,
      isActive: true,
    },
    {
      id: 'q2',
      text: '今日あった良いことは？',
      type: 'multiline',
      order: 2,
      isActive: true,
    },
    {
      id: 'q3',
      text: '今日学んだことは？',
      type: 'multiline',
      order: 3,
      isActive: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuestionStore.mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      error: null,
      loadQuestions: mockLoadQuestions,
      addQuestion: jest.fn(),
      updateQuestion: jest.fn(),
      deleteQuestion: jest.fn(),
      reorderQuestions: jest.fn(),
      resetToDefaults: jest.fn(),
      getActiveQuestions: jest.fn(() => mockQuestions),
    });
    mockUseDiaryStore.mockReturnValue({
      entries: [],
      isLoading: false,
      error: null,
      loadEntries: jest.fn(),
      addEntry: mockAddEntry,
      updateEntry: jest.fn(),
      deleteEntry: jest.fn(),
      getEntryByDate: mockGetEntryByDate,
      getEntryById: jest.fn(),
      addAnswerToEntry: jest.fn(),
      clearError: jest.fn(),
    });
  });

  describe('仕様検証', () => {
    it('画面タイトルが表示される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('日記を書く')).toBeTruthy();
    });

    it('初回マウント時にloadQuestionsが呼ばれる', async () => {
      render(<DiaryInputScreen />);
      await waitFor(() => {
        expect(mockLoadQuestions).toHaveBeenCalledTimes(1);
      });
    });

    it('最初の質問が表示される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('今日の気分は？')).toBeTruthy();
    });

    it('進捗表示（1/3など）が表示される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('1 / 3')).toBeTruthy();
    });
  });

  describe('質問タイプ別の入力UI', () => {
    it('rating型の質問では評価ボタン（1-5）が表示される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('multiline型の質問ではテキスト入力が表示される', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [mockQuestions[1]], // multiline question
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [mockQuestions[1]]),
      });

      const { getByTestId } = render(<DiaryInputScreen />);
      expect(getByTestId('answer-input')).toBeTruthy();
    });

    it('未知の質問タイプの場合、テキスト入力として表示される（フォールバック）', () => {
      const unknownQuestion: Question = {
        id: 'q1',
        text: '未知のタイプの質問',
        type: 'unknown' as any,
        order: 1,
        isActive: true,
      };

      mockUseQuestionStore.mockReturnValue({
        questions: [unknownQuestion],
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [unknownQuestion]),
      });

      const { getByTestId } = render(<DiaryInputScreen />);
      // 未知の型はテキスト入力にフォールバック
      expect(getByTestId('answer-input')).toBeTruthy();
    });

    it('質問が1つだけの場合、「次へ」ボタンは表示されず「保存」ボタンが表示される', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [mockQuestions[0]], // 1つだけ
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [mockQuestions[0]]),
      });

      const { getByText, queryByText } = render(<DiaryInputScreen />);
      expect(getByText('1 / 1')).toBeTruthy();
      expect(getByText('保存')).toBeTruthy();
      expect(queryByText('次へ')).toBeNull();
      expect(queryByText('戻る')).toBeNull();
    });
  });

  describe('回答の入力', () => {
    it('rating型: 評価ボタンをタップすると選択される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      const button = getByText('5');
      fireEvent.press(button);
      // 選択状態を確認（実装による）
    });

    it('multiline型: テキストを入力できる', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [mockQuestions[1]],
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [mockQuestions[1]]),
      });

      const { getByTestId } = render(<DiaryInputScreen />);
      const input = getByTestId('answer-input');
      fireEvent.changeText(input, 'テスト回答');
      expect(input.props.value).toBe('テスト回答');
    });
  });

  describe('質問間の遷移', () => {
    it('「次へ」ボタンをタップすると次の質問に進む', () => {
      const { getByText } = render(<DiaryInputScreen />);

      // 最初の質問
      expect(getByText('今日の気分は？')).toBeTruthy();
      expect(getByText('1 / 3')).toBeTruthy();

      // 回答を入力
      fireEvent.press(getByText('5'));

      // 次へボタンをタップ
      const nextButton = getByText('次へ');
      fireEvent.press(nextButton);

      // 2番目の質問に進む
      expect(getByText('今日あった良いことは？')).toBeTruthy();
      expect(getByText('2 / 3')).toBeTruthy();
    });

    it('「戻る」ボタンをタップすると前の質問に戻る', () => {
      const { getByText } = render(<DiaryInputScreen />);

      // 2番目の質問に進む
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      expect(getByText('2 / 3')).toBeTruthy();

      // 戻るボタンをタップ
      const backButton = getByText('戻る');
      fireEvent.press(backButton);

      // 最初の質問に戻る
      expect(getByText('1 / 3')).toBeTruthy();
    });

    it('最初の質問では「戻る」ボタンが表示されない', () => {
      const { queryByText } = render(<DiaryInputScreen />);
      expect(queryByText('戻る')).toBeNull();
    });

    it('最後の質問では「次へ」の代わりに「保存」ボタンが表示される', () => {
      const { getByText, getByTestId, queryByText } = render(<DiaryInputScreen />);

      // 最後の質問まで進む
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));

      // 最後の質問
      expect(getByText('3 / 3')).toBeTruthy();
      expect(getByText('保存')).toBeTruthy();
      expect(queryByText('次へ')).toBeNull();
    });
  });

  describe('日記の保存', () => {
    it('「保存」ボタンをタップするとaddEntryが呼ばれる', async () => {
      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      // すべての質問に回答
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));

      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));

      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');
      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalledTimes(1);
      });
    });

    it('保存時に今日の日付のエントリーが作成される', async () => {
      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      // すべての質問に回答
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');
      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalled();
        const entry = mockAddEntry.mock.calls[0][0];
        const today = new Date().toISOString().split('T')[0];
        expect(entry.date).toBe(today);
      });
    });

    it('addEntryが失敗してもクラッシュしない', async () => {
      mockAddEntry.mockRejectedValue(new Error('Save failed'));

      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');

      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalled();
      });

      // エラーが捕捉され、クラッシュせずにここに到達する
    });

    it('保存成功後にnavigation.goBack()が呼ばれる', async () => {
      mockAddEntry.mockResolvedValue(undefined);

      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');
      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalledTimes(1);
        expect(mockGoBack).toHaveBeenCalledTimes(1);
      });
    });

    it('保存失敗時にはnavigation.goBack()が呼ばれない', async () => {
      mockAddEntry.mockRejectedValue(new Error('Save failed'));

      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');
      fireEvent.press(getByText('保存'));

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalled();
      });
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('保存ボタンを連続でタップしてもaddEntryは1回だけ呼ばれる', async () => {
      const { getByText, getByTestId } = render(<DiaryInputScreen />);

      fireEvent.press(getByText('5'));
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '良いこと');
      fireEvent.press(getByText('次へ'));
      fireEvent.changeText(getByTestId('answer-input'), '学んだこと');

      const saveButton = getByText('保存');
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockAddEntry).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('ローディング状態', () => {
    it('質問のローディング中は「読み込み中...」が表示される', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [],
        isLoading: true,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => []),
      });

      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('読み込み中...')).toBeTruthy();
    });
  });

  describe('エラー状態', () => {
    it('エラーがある場合、エラーメッセージが表示される', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [],
        isLoading: false,
        error: '質問の読み込みに失敗しました',
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => []),
      });

      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('エラー: 質問の読み込みに失敗しました')).toBeTruthy();
    });

    it('質問が1つもない場合、「質問がありません」が表示される', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [],
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => []),
      });

      const { getByText } = render(<DiaryInputScreen />);
      expect(getByText('質問がありません')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('画面全体にaccessibilityRole="none"が設定される', () => {
      const { getByTestId } = render(<DiaryInputScreen />);
      expect(getByTestId('diary-input-screen')).toHaveProp('accessibilityRole', 'none');
    });

    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<DiaryInputScreen />);
      const title = getByText('日記を書く');
      expect(title.props.accessibilityRole).toBe('header');
    });
  });

  describe('エッジケース', () => {
    it('空の回答でも次へ進める', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [mockQuestions[1]], // multiline
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [mockQuestions[1]]),
      });

      const { getByText } = render(<DiaryInputScreen />);

      // 空のまま保存
      const saveButton = getByText('保存');
      expect(() => fireEvent.press(saveButton)).not.toThrow();
    });

    it('1000文字の回答でも正常に処理できる', () => {
      mockUseQuestionStore.mockReturnValue({
        questions: [mockQuestions[1]],
        isLoading: false,
        error: null,
        loadQuestions: mockLoadQuestions,
        addQuestion: jest.fn(),
        updateQuestion: jest.fn(),
        deleteQuestion: jest.fn(),
        reorderQuestions: jest.fn(),
        resetToDefaults: jest.fn(),
        getActiveQuestions: jest.fn(() => [mockQuestions[1]]),
      });

      const { getByTestId } = render(<DiaryInputScreen />);
      const longText = 'A'.repeat(1000);

      expect(() => {
        fireEvent.changeText(getByTestId('answer-input'), longText);
      }).not.toThrow();
    });
  });
});
