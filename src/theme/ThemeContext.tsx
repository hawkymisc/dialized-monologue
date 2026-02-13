/**
 * テーマコンテキスト
 * アプリ全体でテーマを共有するためのContext + Provider
 */
import React, { createContext, useContext, useMemo } from 'react';
import { ThemeColors, LIGHT_THEME, DARK_THEME } from './colors';
import { useSettingsStore } from '../stores/settingsStore';

// テーマコンテキストの型
interface ThemeContextValue {
  theme: ThemeColors;
  isDarkMode: boolean;
}

// デフォルト値
const ThemeContext = createContext<ThemeContextValue>({
  theme: LIGHT_THEME,
  isDarkMode: false,
});

/**
 * テーマプロバイダー
 * アプリのルートで使用し、全コンポーネントにテーマを提供する
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useSettingsStore((state) => state.settings);
  const isDarkMode = settings.isDarkMode;

  const value = useMemo(
    () => ({
      theme: isDarkMode ? DARK_THEME : LIGHT_THEME,
      isDarkMode,
    }),
    [isDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * テーマを使用するためのフック
 * どのコンポーネントからでもテーマ情報にアクセス可能
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * テーマ色のみを取得するフック
 * スタイリング用にテーマ色のみが必要な場合に使用
 */
export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();
  return theme;
};
