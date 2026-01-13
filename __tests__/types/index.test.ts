/**
 * 型定義のテスト
 *
 * TDD: RED phase
 * - DiaryEntry, DiaryAnswer, Question, Settings の型が正しく定義されているか
 * - 型ガード関数が正しく動作するか
 */

import {
  DiaryEntry,
  DiaryAnswer,
  Question,
  QuestionType,
  Settings,
  ReminderTime,
  isDiaryEntry,
  isDiaryAnswer,
  isQuestion,
  createDiaryEntry,
  createQuestion,
} from '../../src/types';

describe('DiaryAnswer', () => {
  it('should have required properties', () => {
    const answer: DiaryAnswer = {
      questionId: 'q1',
      questionText: '今日の気分は？',
      value: '良い',
      type: 'text',
    };

    expect(answer.questionId).toBe('q1');
    expect(answer.questionText).toBe('今日の気分は？');
    expect(answer.value).toBe('良い');
    expect(answer.type).toBe('text');
  });

  it('should allow rating type with number value', () => {
    const answer: DiaryAnswer = {
      questionId: 'q1',
      questionText: '今日の気分は？',
      value: 4,
      type: 'rating',
    };

    expect(answer.value).toBe(4);
    expect(answer.type).toBe('rating');
  });
});

describe('DiaryEntry', () => {
  it('should have required properties', () => {
    const entry: DiaryEntry = {
      id: 'entry-1',
      date: '2024-01-13',
      createdAt: '2024-01-13T21:00:00Z',
      updatedAt: '2024-01-13T21:00:00Z',
      answers: [],
    };

    expect(entry.id).toBe('entry-1');
    expect(entry.date).toBe('2024-01-13');
    expect(entry.createdAt).toBeDefined();
    expect(entry.updatedAt).toBeDefined();
    expect(entry.answers).toEqual([]);
  });

  it('should contain multiple answers', () => {
    const entry: DiaryEntry = {
      id: 'entry-1',
      date: '2024-01-13',
      createdAt: '2024-01-13T21:00:00Z',
      updatedAt: '2024-01-13T21:00:00Z',
      answers: [
        { questionId: 'q1', questionText: '気分', value: 4, type: 'rating' },
        { questionId: 'q2', questionText: '良かったこと', value: 'テスト合格', type: 'text' },
      ],
    };

    expect(entry.answers).toHaveLength(2);
  });
});

describe('Question', () => {
  it('should have required properties', () => {
    const question: Question = {
      id: 'q1',
      text: '今日の気分は？',
      type: 'rating',
      order: 1,
      isActive: true,
    };

    expect(question.id).toBe('q1');
    expect(question.text).toBe('今日の気分は？');
    expect(question.type).toBe('rating');
    expect(question.order).toBe(1);
    expect(question.isActive).toBe(true);
  });

  it('should have optional options for choice type', () => {
    const question: Question = {
      id: 'q1',
      text: '今日の天気は？',
      type: 'choice',
      options: ['晴れ', '曇り', '雨'],
      order: 1,
      isActive: true,
    };

    expect(question.options).toEqual(['晴れ', '曇り', '雨']);
  });
});

describe('QuestionType', () => {
  it('should include all valid types', () => {
    const types: QuestionType[] = ['text', 'multiline', 'rating', 'choice'];
    expect(types).toContain('text');
    expect(types).toContain('multiline');
    expect(types).toContain('rating');
    expect(types).toContain('choice');
  });
});

describe('ReminderTime', () => {
  it('should have hour and minute', () => {
    const time: ReminderTime = {
      hour: 21,
      minute: 0,
      isEnabled: true,
    };

    expect(time.hour).toBe(21);
    expect(time.minute).toBe(0);
    expect(time.isEnabled).toBe(true);
  });
});

describe('Settings', () => {
  it('should have reminder times array', () => {
    const settings: Settings = {
      reminderTimes: [
        { hour: 7, minute: 0, isEnabled: true },
        { hour: 21, minute: 0, isEnabled: true },
      ],
      isDarkMode: false,
      notificationsEnabled: true,
    };

    expect(settings.reminderTimes).toHaveLength(2);
    expect(settings.isDarkMode).toBe(false);
    expect(settings.notificationsEnabled).toBe(true);
  });
});

describe('Type Guards', () => {
  describe('isDiaryAnswer', () => {
    it('should return true for valid DiaryAnswer', () => {
      const answer = {
        questionId: 'q1',
        questionText: '質問',
        value: '回答',
        type: 'text',
      };
      expect(isDiaryAnswer(answer)).toBe(true);
    });

    it('should return false for invalid object', () => {
      expect(isDiaryAnswer(null)).toBe(false);
      expect(isDiaryAnswer({})).toBe(false);
      expect(isDiaryAnswer({ questionId: 'q1' })).toBe(false);
    });
  });

  describe('isDiaryEntry', () => {
    it('should return true for valid DiaryEntry', () => {
      const entry = {
        id: 'entry-1',
        date: '2024-01-13',
        createdAt: '2024-01-13T21:00:00Z',
        updatedAt: '2024-01-13T21:00:00Z',
        answers: [],
      };
      expect(isDiaryEntry(entry)).toBe(true);
    });

    it('should return false for invalid object', () => {
      expect(isDiaryEntry(null)).toBe(false);
      expect(isDiaryEntry({})).toBe(false);
    });
  });

  describe('isQuestion', () => {
    it('should return true for valid Question', () => {
      const question = {
        id: 'q1',
        text: '質問',
        type: 'text',
        order: 1,
        isActive: true,
      };
      expect(isQuestion(question)).toBe(true);
    });

    it('should return false for invalid object', () => {
      expect(isQuestion(null)).toBe(false);
      expect(isQuestion({})).toBe(false);
    });
  });
});

describe('Factory Functions', () => {
  describe('createDiaryEntry', () => {
    it('should create a new DiaryEntry with generated id and timestamps', () => {
      const entry = createDiaryEntry('2024-01-13');

      expect(entry.id).toBeDefined();
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.date).toBe('2024-01-13');
      expect(entry.createdAt).toBeDefined();
      expect(entry.updatedAt).toBeDefined();
      expect(entry.answers).toEqual([]);
    });

    it('should create entries with unique ids', () => {
      const entry1 = createDiaryEntry('2024-01-13');
      const entry2 = createDiaryEntry('2024-01-13');

      expect(entry1.id).not.toBe(entry2.id);
    });
  });

  describe('createQuestion', () => {
    it('should create a new Question with generated id', () => {
      const question = createQuestion('今日の気分は？', 'rating', 1);

      expect(question.id).toBeDefined();
      expect(question.text).toBe('今日の気分は？');
      expect(question.type).toBe('rating');
      expect(question.order).toBe(1);
      expect(question.isActive).toBe(true);
    });

    it('should accept options for choice type', () => {
      const question = createQuestion('天気', 'choice', 1, ['晴れ', '曇り']);

      expect(question.options).toEqual(['晴れ', '曇り']);
    });
  });
});
