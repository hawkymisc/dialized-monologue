/**
 * デフォルト質問
 */

import { Question } from '../types';

/**
 * デフォルトの質問セット
 */
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'default-1',
    text: '今日の気分は？',
    type: 'rating',
    order: 1,
    isActive: true,
  },
  {
    id: 'default-2',
    text: '今日あった良いことは？',
    type: 'multiline',
    order: 2,
    isActive: true,
  },
  {
    id: 'default-3',
    text: '今日学んだこと・気づいたことは？',
    type: 'multiline',
    order: 3,
    isActive: true,
  },
  {
    id: 'default-4',
    text: '明日の目標は？',
    type: 'multiline',
    order: 4,
    isActive: true,
  },
];
