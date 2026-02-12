/**
 * SettingsScreen
 * 設定画面 - 各種設定へのナビゲーション
 *
 * TODO (将来の改善):
 * - バージョン情報の表示
 * - アプリ情報セクション
 * - ヘルプ・サポートリンク
 * - アカウント設定（将来的にクラウド同期する場合）
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ListItem } from '../components/ListItem';

// カラー定数
const COLORS = {
  background: '#F5F5F5',
  text: '#000000',
};

// フォントサイズ定数
const FONT_SIZES = {
  title: 24,
};

// 余白定数
const SPACING = {
  container: 16,
  titleBottom: 24,
};

// ナビゲーション先の画面名
type SettingScreen =
  | 'ReminderSettings'
  | 'QuestionSettings'
  | 'DataManagement'
  | 'DisplaySettings';

interface SettingsScreenProps {
  onNavigate?: (screen: SettingScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const handleNavigate = (screen: SettingScreen) => {
    try {
      if (onNavigate) {
        onNavigate(screen);
      }
    } catch (error) {
      // エラーが発生してもクラッシュしない
      console.error('Navigation error:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID="settings-screen"
      accessibilityRole="none"
    >
      {/* タイトル */}
      <Text style={styles.title} accessibilityRole="header">
        設定
      </Text>

      {/* 設定項目一覧 */}
      <ListItem
        title="リマインダー設定"
        subtitle="通知時刻の設定"
        onPress={() => handleNavigate('ReminderSettings')}
        testID="setting-item-reminder"
      />

      <ListItem
        title="質問設定"
        subtitle="質問の追加・編集・削除"
        onPress={() => handleNavigate('QuestionSettings')}
        testID="setting-item-question"
      />

      <ListItem
        title="データ管理"
        subtitle="エクスポート・削除"
        onPress={() => handleNavigate('DataManagement')}
        testID="setting-item-data"
      />

      <ListItem
        title="表示設定"
        subtitle="ダークモード設定"
        onPress={() => handleNavigate('DisplaySettings')}
        testID="setting-item-display"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  contentContainer: {
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
});
