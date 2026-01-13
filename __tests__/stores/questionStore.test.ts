/**
 * 質問ストアのテスト
 *
 * TDD: RED -> GREEN -> REFACTOR
 */

import { useQuestionStore } from '../../src/stores/questionStore';
import { StorageService } from '../../src/services/storage';
import { Question, createQuestion } from '../../src/types';

// StorageServiceをモック
jest.mock('../../src/services/storage', () => ({
  StorageService: {
    getQuestions: jest.fn(),
    saveQuestions: jest.fn(),
  },
}));

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('useQuestionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useQuestionStore.setState({
      questions: [],
      isLoading: false,
      error: null,
    });
  });

  describe('initial state', () => {
    it('should have empty questions array', () => {
      expect(useQuestionStore.getState().questions).toEqual([]);
    });
  });

  describe('loadQuestions', () => {
    it('should load questions from storage', async () => {
      const mockQuestions: Question[] = [
        { id: '1', text: '今日の気分は？', type: 'rating', order: 1, isActive: true },
      ];
      mockStorageService.getQuestions.mockResolvedValue(mockQuestions);

      await useQuestionStore.getState().loadQuestions();

      expect(useQuestionStore.getState().questions).toEqual(mockQuestions);
    });

    it('should load default questions if storage is empty', async () => {
      mockStorageService.getQuestions.mockResolvedValue([]);

      await useQuestionStore.getState().loadQuestions();

      const questions = useQuestionStore.getState().questions;
      expect(questions.length).toBeGreaterThan(0);
    });
  });

  describe('addQuestion', () => {
    it('should add new question', async () => {
      mockStorageService.saveQuestions.mockResolvedValue();
      const newQuestion = createQuestion('新しい質問', 'text', 1);

      await useQuestionStore.getState().addQuestion(newQuestion);

      expect(useQuestionStore.getState().questions).toContainEqual(newQuestion);
    });
  });

  describe('updateQuestion', () => {
    it('should update existing question', async () => {
      const existing: Question = { id: '1', text: '古い質問', type: 'text', order: 1, isActive: true };
      useQuestionStore.setState({ questions: [existing] });
      mockStorageService.saveQuestions.mockResolvedValue();

      const updated: Question = { ...existing, text: '更新された質問' };
      await useQuestionStore.getState().updateQuestion(updated);

      expect(useQuestionStore.getState().questions[0].text).toBe('更新された質問');
    });
  });

  describe('deleteQuestion', () => {
    it('should delete question by id', async () => {
      const questions: Question[] = [
        { id: '1', text: 'Q1', type: 'text', order: 1, isActive: true },
        { id: '2', text: 'Q2', type: 'text', order: 2, isActive: true },
      ];
      useQuestionStore.setState({ questions });
      mockStorageService.saveQuestions.mockResolvedValue();

      await useQuestionStore.getState().deleteQuestion('1');

      expect(useQuestionStore.getState().questions).toHaveLength(1);
      expect(useQuestionStore.getState().questions[0].id).toBe('2');
    });
  });

  describe('reorderQuestions', () => {
    it('should update question orders', async () => {
      const questions: Question[] = [
        { id: '1', text: 'Q1', type: 'text', order: 1, isActive: true },
        { id: '2', text: 'Q2', type: 'text', order: 2, isActive: true },
      ];
      useQuestionStore.setState({ questions });
      mockStorageService.saveQuestions.mockResolvedValue();

      await useQuestionStore.getState().reorderQuestions(['2', '1']);

      const reordered = useQuestionStore.getState().questions;
      expect(reordered.find((q) => q.id === '2')?.order).toBe(1);
      expect(reordered.find((q) => q.id === '1')?.order).toBe(2);
    });
  });

  describe('toggleQuestionActive', () => {
    it('should toggle question active state', async () => {
      const question: Question = { id: '1', text: 'Q1', type: 'text', order: 1, isActive: true };
      useQuestionStore.setState({ questions: [question] });
      mockStorageService.saveQuestions.mockResolvedValue();

      await useQuestionStore.getState().toggleQuestionActive('1');

      expect(useQuestionStore.getState().questions[0].isActive).toBe(false);
    });
  });

  describe('getActiveQuestions', () => {
    it('should return only active questions sorted by order', () => {
      const questions: Question[] = [
        { id: '1', text: 'Q1', type: 'text', order: 2, isActive: true },
        { id: '2', text: 'Q2', type: 'text', order: 1, isActive: false },
        { id: '3', text: 'Q3', type: 'text', order: 3, isActive: true },
      ];
      useQuestionStore.setState({ questions });

      const active = useQuestionStore.getState().getActiveQuestions();

      expect(active).toHaveLength(2);
      expect(active[0].id).toBe('1');
      expect(active[1].id).toBe('3');
    });
  });

  describe('resetToDefaults', () => {
    it('should reset to default questions', async () => {
      useQuestionStore.setState({ questions: [] });
      mockStorageService.saveQuestions.mockResolvedValue();

      await useQuestionStore.getState().resetToDefaults();

      const questions = useQuestionStore.getState().questions;
      expect(questions.length).toBeGreaterThan(0);
    });
  });
});
