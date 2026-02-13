/**
 * テーマ設定
 * ダークモード/Lightモードの配色を管理
 */
import { useSettingsStore } from '../stores/settingsStore';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  error: string;
}

export const LIGHT_THEME: ThemeColors = {
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  primary: '#007AFF',
  error: '#FF3B30',
};

export const DARK_THEME: ThemeColors = {
  background: '#1A1A1A',
  cardBackground: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#3A3A3A',
  primary: '#0A84FF',
  error: '#FF453A',
};

/**
 * 現在のテーマ色を取得するフック
 */
export const useTheme = (): ThemeColors => {
  const isDarkMode = useSettingsStore((state) => state.settings.isDarkMode);
  return isDarkMode ? DARK_THEME : LIGHT_THEME;
};
