import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';
import { useSettingsStore } from './src/stores/settingsStore';

/**
 * StatusBar コンポーネント
 * テーマに応じてスタイルを切り替える
 */
const ThemedStatusBar = () => {
  const { isDarkMode } = useTheme();
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} />;
};

/**
 * アプリ初期化コンポーネント
 * 設定をロードしてから子コンポーネントを表示
 */
const AppContent = () => {
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <>
      <AppNavigator />
      <ThemedStatusBar />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
