import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/stores/settingsStore';

export default function App() {
  const { settings, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const statusBarStyle = settings.isDarkMode ? 'light' : 'auto';

  return (
    <>
      <AppNavigator />
      <StatusBar style={statusBarStyle} />
    </>
  );
}
