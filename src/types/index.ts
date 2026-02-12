/**
 * 型定義
 */

// ナビゲーション型を再エクスポート
export type {
  RootStackParamList,
  HomeScreenProps,
  DiaryInputScreenProps,
  DiaryDetailScreenProps,
  SettingsScreenProps,
} from './navigation';

// 質問の回答タイプ
export type QuestionType = 'text' | 'multiline' | 'rating' | 'choice';

// 日記の回答タイプ
export type AnswerType = 'text' | 'rating';

/**
 * 日記の回答
 */
export interface DiaryAnswer {
  questionId: string;
  questionText: string;
  value: string | number;
  type: AnswerType;
}

/**
 * 日記エントリー
 */
export interface DiaryEntry {
  id: string;
  date: string; // ISO 8601形式 (YYYY-MM-DD)
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
  answers: DiaryAnswer[];
}

/**
 * 質問
 */
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // choice型の場合の選択肢
  order: number;
  isActive: boolean;
}

/**
 * リマインダー時間
 */
export interface ReminderTime {
  hour: number;
  minute: number;
  isEnabled: boolean;
}

/**
 * アプリ設定
 */
export interface Settings {
  reminderTimes: ReminderTime[];
  isDarkMode: boolean;
  notificationsEnabled: boolean;
}

// 型ガード関数

/**
 * DiaryAnswerの型ガード
 */
export function isDiaryAnswer(obj: unknown): obj is DiaryAnswer {
  if (obj === null || typeof obj !== 'object') return false;
  const answer = obj as DiaryAnswer;
  return (
    typeof answer.questionId === 'string' &&
    typeof answer.questionText === 'string' &&
    (typeof answer.value === 'string' || typeof answer.value === 'number') &&
    (answer.type === 'text' || answer.type === 'rating')
  );
}

/**
 * DiaryEntryの型ガード
 */
export function isDiaryEntry(obj: unknown): obj is DiaryEntry {
  if (obj === null || typeof obj !== 'object') return false;
  const entry = obj as DiaryEntry;
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    typeof entry.createdAt === 'string' &&
    typeof entry.updatedAt === 'string' &&
    Array.isArray(entry.answers)
  );
}

/**
 * Questionの型ガード
 */
export function isQuestion(obj: unknown): obj is Question {
  if (obj === null || typeof obj !== 'object') return false;
  const question = obj as Question;
  return (
    typeof question.id === 'string' &&
    typeof question.text === 'string' &&
    ['text', 'multiline', 'rating', 'choice'].includes(question.type) &&
    typeof question.order === 'number' &&
    typeof question.isActive === 'boolean'
  );
}

// ファクトリ関数

/**
 * UUIDを生成（簡易版）
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * DiaryEntryを作成
 */
export function createDiaryEntry(date: string): DiaryEntry {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    date,
    createdAt: now,
    updatedAt: now,
    answers: [],
  };
}

/**
 * Questionを作成
 */
export function createQuestion(
  text: string,
  type: QuestionType,
  order: number,
  options?: string[]
): Question {
  return {
    id: generateId(),
    text,
    type,
    order,
    isActive: true,
    ...(options && { options }),
  };
}
