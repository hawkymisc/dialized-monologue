/**
 * 質問ストア
 *
 * Zustandによる質問の状態管理
 */

import { create } from 'zustand';
import { Question } from '../types';
import { StorageService } from '../services/storage';
import { DEFAULT_QUESTIONS } from '../constants/defaultQuestions';

interface QuestionState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

interface QuestionActions {
  loadQuestions: () => Promise<void>;
  addQuestion: (question: Question) => Promise<void>;
  updateQuestion: (question: Question) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  reorderQuestions: (orderedIds: string[]) => Promise<void>;
  toggleQuestionActive: (id: string) => Promise<void>;
  getActiveQuestions: () => Question[];
  resetToDefaults: () => Promise<void>;
  clearError: () => void;
}

type QuestionStore = QuestionState & QuestionActions;

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  // State
  questions: [],
  isLoading: false,
  error: null,

  // Actions
  loadQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      let questions = await StorageService.getQuestions();

      // ストレージが空の場合はデフォルト質問を使用
      if (questions.length === 0) {
        questions = [...DEFAULT_QUESTIONS];
        await StorageService.saveQuestions(questions);
      }

      set({ questions, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  addQuestion: async (question: Question) => {
    try {
      const newQuestions = [...get().questions, question];
      await StorageService.saveQuestions(newQuestions);
      set({ questions: newQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  updateQuestion: async (question: Question) => {
    try {
      const newQuestions = get().questions.map((q) =>
        q.id === question.id ? question : q
      );
      await StorageService.saveQuestions(newQuestions);
      set({ questions: newQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  deleteQuestion: async (id: string) => {
    try {
      const newQuestions = get().questions.filter((q) => q.id !== id);
      await StorageService.saveQuestions(newQuestions);
      set({ questions: newQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  reorderQuestions: async (orderedIds: string[]) => {
    try {
      const newQuestions = get().questions.map((q) => ({
        ...q,
        order: orderedIds.indexOf(q.id) + 1,
      }));
      await StorageService.saveQuestions(newQuestions);
      set({ questions: newQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  toggleQuestionActive: async (id: string) => {
    try {
      const newQuestions = get().questions.map((q) =>
        q.id === id ? { ...q, isActive: !q.isActive } : q
      );
      await StorageService.saveQuestions(newQuestions);
      set({ questions: newQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  getActiveQuestions: () => {
    return get()
      .questions.filter((q) => q.isActive)
      .sort((a, b) => a.order - b.order);
  },

  resetToDefaults: async () => {
    try {
      const defaultQuestions = [...DEFAULT_QUESTIONS];
      await StorageService.saveQuestions(defaultQuestions);
      set({ questions: defaultQuestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
