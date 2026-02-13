/**
 * ReminderSettingsScreen
 * リマインダー設定画面 - 通知時刻の追加・削除・ON/OFF
 *
 * TODO: Phase 5Aで完全実装
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const ReminderSettingsScreen: React.FC = () => {
  return (
    <View style={styles.container} testID="reminder-settings-screen">
      <Text style={styles.title} accessibilityRole="header">
        リマインダー設定
      </Text>
      <Text style={styles.placeholder}>実装予定</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
  } as TextStyle,
  placeholder: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
});
