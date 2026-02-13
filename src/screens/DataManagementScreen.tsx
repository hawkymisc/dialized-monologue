/**
 * DataManagementScreen
 * データ管理画面 - エクスポート(JSON/CSV)・全データ削除
 *
 * TODO: Phase 5Aで完全実装
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const DataManagementScreen: React.FC = () => {
  return (
    <View style={styles.container} testID="data-management-screen">
      <Text style={styles.title} accessibilityRole="header">
        データ管理
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
