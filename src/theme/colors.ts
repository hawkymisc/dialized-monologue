/**
 * テーマ色の定義
 * ライトモードとダークモードの配色セット
 */

export interface ThemeColors {
  // 背景色
  background: string;
  cardBackground: string;

  // テキスト色
  text: string;
  textSecondary: string;

  // UI要素
  border: string;
  primary: string;
  error: string;

  // 追加色
  white: string;
  selected: string;
}

export const LIGHT_THEME: ThemeColors = {
  // 背景色
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',

  // テキスト色
  text: '#000000',
  textSecondary: '#666666',

  // UI要素
  border: '#E0E0E0',
  primary: '#007AFF',
  error: '#FF3B30',

  // 追加色
  white: '#FFFFFF',
  selected: '#E3F2FD',
};

export const DARK_THEME: ThemeColors = {
  // 背景色
  background: '#1A1A1A',
  cardBackground: '#2A2A2A',

  // テキスト色
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',

  // UI要素
  border: '#3A3A3A',
  primary: '#0A84FF',
  error: '#FF453A',

  // 追加色
  white: '#1A1A1A',
  selected: '#1E3A5F',
};
