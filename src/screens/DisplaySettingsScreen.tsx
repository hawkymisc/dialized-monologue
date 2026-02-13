/**
 * DisplaySettingsScreen
 * 表示設定画面 - ダークモード設定
 */
import React, { useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

const COLORS = {
  background: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
};

const FONT_SIZES = {
  title: 24,
  body: 16,
  caption: 14,
};

const SPACING = {
  container: 16,
  titleBottom: 24,
  itemGap: 12,
};

export const DisplaySettingsScreen: React.FC = () => {
  const { settings, loadSettings, setDarkMode } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={styles.container} testID="display-settings-screen">
      <Text style={styles.title} accessibilityRole="header">
        表示設定
      </Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>ダークモード</Text>
        <Switch
          testID="dark-mode-switch"
          value={settings.isDarkMode}
          onValueChange={(value: boolean) => setDarkMode(value)}
          accessibilityLabel="ダークモード切り替え"
          accessibilityRole="switch"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.itemGap,
  } as ViewStyle,
  label: {
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
  } as TextStyle,
});
