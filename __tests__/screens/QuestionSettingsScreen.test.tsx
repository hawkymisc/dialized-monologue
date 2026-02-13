/**
 * QuestionSettingsScreen テスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QuestionSettingsScreen } from '../../src/screens/QuestionSettingsScreen';
import { useQuestionStore } from '../../src/stores/questionStore';
import { Question } from '../../src/types';

const mockLoadQuestions = jest.fn();
const mockDeleteQuestion = jest.fn();
const mockToggleQuestionActive = jest.fn();
const mockResetToDefaults = jest.fn();

jest.mock('../../src/stores/questionStore', () => ({
  useQuestionStore: jest.fn(),
}));

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const mockUseQuestionStore = useQuestionStore as jest.MockedFunction<
  typeof useQuestionStore
>;

const createMockQuestion = (
  overrides: Partial<Question> = {}
): Question => ({
  id: 'q1',
  text: '今日の気分はどうですか？',
  type: 'text',
  order: 1,
  isActive: true,
  ...overrides,
});

const setupMockStore = (questions: Question[] = []) => {
  mockUseQuestionStore.mockReturnValue({
    questions,
    isLoading: false,
    error: null,
    loadQuestions: mockLoadQuestions,
    deleteQuestion: mockDeleteQuestion,
    toggleQuestionActive: mockToggleQuestionActive,
    resetToDefaults: mockResetToDefaults,
    addQuestion: jest.fn(),
    updateQuestion: jest.fn(),
    reorderQuestions: jest.fn(),
    getActiveQuestions: jest.fn(),
    clearError: jest.fn(),
  } as any);
};

describe('QuestionSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('仕様検証', () => {
    it('画面タイトル「質問設定」が表示される', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('質問設定')).toBeTruthy();
    });

    it('画面タイトルのフォントサイズは24、太字である', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      const title = getByText('質問設定');
      const style = require('react-native').StyleSheet.flatten(title.props.style);
      expect(style.fontSize).toBe(24);
      expect(style.fontWeight).toBe('600');
    });

    it('画面の背景色は#F5F5F5である', () => {
      setupMockStore([]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      const screen = getByTestId('question-settings-screen');
      const style = require('react-native').StyleSheet.flatten(screen.props.style);
      expect(style.backgroundColor).toBe('#F5F5F5');
    });

    it('質問が0件の場合「質問がありません」と表示される', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('質問がありません')).toBeTruthy();
    });

    it('質問がある場合、質問テキストが表示される', () => {
      setupMockStore([createMockQuestion()]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('今日の気分はどうですか？')).toBeTruthy();
    });

    it('質問の種類（type）が日本語で表示される - text', () => {
      setupMockStore([createMockQuestion({ type: 'text' })]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('テキスト')).toBeTruthy();
    });

    it('質問の種類（type）が日本語で表示される - multiline', () => {
      setupMockStore([createMockQuestion({ type: 'multiline' })]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('複数行テキスト')).toBeTruthy();
    });

    it('質問の種類（type）が日本語で表示される - rating', () => {
      setupMockStore([createMockQuestion({ type: 'rating' })]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('5段階評価')).toBeTruthy();
    });

    it('質問の種類（type）が日本語で表示される - choice', () => {
      setupMockStore([createMockQuestion({ type: 'choice' })]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('選択式')).toBeTruthy();
    });

    it('デフォルトにリセットボタンが表示される', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('デフォルトにリセット')).toBeTruthy();
    });

    it('各質問にSwitchが表示される', () => {
      setupMockStore([createMockQuestion()]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      expect(getByTestId('question-switch-q1')).toBeTruthy();
    });

    it('各質問に削除ボタンが表示される', () => {
      setupMockStore([createMockQuestion()]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      expect(getByTestId('question-delete-q1')).toBeTruthy();
    });

    it('useEffectでloadQuestionsが呼ばれる', () => {
      setupMockStore([]);
      render(<QuestionSettingsScreen />);
      expect(mockLoadQuestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('インタラクション', () => {
    it('SwitchトグルでtoggleQuestionActive(id)が呼ばれる', () => {
      setupMockStore([createMockQuestion({ id: 'q1', isActive: true })]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      fireEvent(getByTestId('question-switch-q1'), 'valueChange', false);
      expect(mockToggleQuestionActive).toHaveBeenCalledWith('q1');
    });

    it('削除ボタンタップでdeleteQuestion(id)が呼ばれる', () => {
      setupMockStore([createMockQuestion({ id: 'q1' })]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      fireEvent.press(getByTestId('question-delete-q1'));
      expect(mockDeleteQuestion).toHaveBeenCalledWith('q1');
    });

    it('リセットボタンタップでAlert.alertが表示される', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      fireEvent.press(getByText('デフォルトにリセット'));
      expect(Alert.alert).toHaveBeenCalledWith(
        '確認',
        '質問をデフォルトに戻しますか？',
        expect.arrayContaining([
          expect.objectContaining({ text: 'キャンセル' }),
          expect.objectContaining({ text: 'リセット' }),
        ])
      );
    });

    it('Alert確認でresetToDefaults()が呼ばれる', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      fireEvent.press(getByText('デフォルトにリセット'));

      // Alertのボタンコールバックを取得して実行
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const resetButton = buttons.find(
        (b: { text: string }) => b.text === 'リセット'
      );
      resetButton.onPress();

      expect(mockResetToDefaults).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      setupMockStore([]);
      const { getByText } = render(<QuestionSettingsScreen />);
      const title = getByText('質問設定');
      expect(title.props.accessibilityRole).toBe('header');
    });

    it('削除ボタンにaccessibilityLabel が設定される', () => {
      setupMockStore([createMockQuestion({ id: 'q1', text: '今日の気分はどうですか？' })]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      const deleteButton = getByTestId('question-delete-q1');
      expect(deleteButton.props.accessibilityLabel).toBe(
        '今日の気分はどうですか？を削除'
      );
    });
  });

  describe('エッジケース', () => {
    it('複数の質問が正しく表示される', () => {
      const questions = [
        createMockQuestion({ id: 'q1', text: '質問1', order: 1 }),
        createMockQuestion({ id: 'q2', text: '質問2', order: 2 }),
        createMockQuestion({ id: 'q3', text: '質問3', order: 3 }),
      ];
      setupMockStore(questions);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('質問1')).toBeTruthy();
      expect(getByText('質問2')).toBeTruthy();
      expect(getByText('質問3')).toBeTruthy();
    });

    it('異なるtype（text, multiline, rating）が同時に表示される', () => {
      const questions = [
        createMockQuestion({ id: 'q1', text: '質問A', type: 'text', order: 1 }),
        createMockQuestion({ id: 'q2', text: '質問B', type: 'multiline', order: 2 }),
        createMockQuestion({ id: 'q3', text: '質問C', type: 'rating', order: 3 }),
      ];
      setupMockStore(questions);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText('テキスト')).toBeTruthy();
      expect(getByText('複数行テキスト')).toBeTruthy();
      expect(getByText('5段階評価')).toBeTruthy();
    });

    it('isActive=falseの質問のSwitchはfalseである', () => {
      setupMockStore([createMockQuestion({ id: 'q1', isActive: false })]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      const switchElement = getByTestId('question-switch-q1');
      expect(switchElement.props.value).toBe(false);
    });

    it('isActive=trueの質問のSwitchはtrueである', () => {
      setupMockStore([createMockQuestion({ id: 'q1', isActive: true })]);
      const { getByTestId } = render(<QuestionSettingsScreen />);
      const switchElement = getByTestId('question-switch-q1');
      expect(switchElement.props.value).toBe(true);
    });

    it('質問テキストが非常に長くてもレンダリングできる', () => {
      const longText = 'あ'.repeat(500);
      setupMockStore([createMockQuestion({ id: 'q1', text: longText })]);
      const { getByText } = render(<QuestionSettingsScreen />);
      expect(getByText(longText)).toBeTruthy();
    });

    it('質問がある場合「質問がありません」は表示されない', () => {
      setupMockStore([createMockQuestion()]);
      const { queryByText } = render(<QuestionSettingsScreen />);
      expect(queryByText('質問がありません')).toBeNull();
    });
  });
});
