/**
 * HomeScreen
 * ホーム画面 - 今日の日記入力 / 過去の日記一覧
 *
 * TODO (将来の改善):
 * - 日付フォーマットの改善（例: "1月25日（土）"）
 * - エントリープレビューの表示（ListItemのsubtitle）
 * - 気分アイコンの表示（ratingに基づく絵文字）
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDiaryStore } from '../stores/diaryStore';
import { Button } from '../components/Button';
import { ListItem } from '../components/ListItem';
import { DiaryEntry } from '../types';
import type { RootStackParamList } from '../types/navigation';
import { useThemeColors, ThemeColors } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// フォントサイズ定数
const FONT_SIZES = {
  title: 24,
  sectionTitle: 18,
  body: 16,
  caption: 14,
};

// 余白定数
const SPACING = {
  container: 16,
  sectionBottom: 24,
  titleBottom: 24,
  sectionTitleBottom: 12,
  emptyTop: 20,
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    entries,
    isLoading,
    error,
    loadEntries,
    getEntryByDate,
  } = useDiaryStore();
  const theme = useThemeColors();
  const styles = createStyles(theme);

  useEffect(() => {
    Promise.resolve(loadEntries()).catch(() => {
      // エラーはストアのerror状態で管理される
    });
  }, [loadEntries]);

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getEntryByDate(today);

  // エントリーを日付降順でソート
  const sortedEntries = entries
    ? [...entries].sort((a, b) => b.date.localeCompare(a.date))
    : [];

  // ローディング中
  if (isLoading) {
    return (
      <View style={styles.container} testID="home-screen" accessibilityRole="none">
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  // エラー
  if (error) {
    return (
      <View style={styles.container} testID="home-screen" accessibilityRole="none">
        <Text style={styles.errorText}>エラー: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="home-screen" accessibilityRole="none">
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          日記
        </Text>
        <Button
          title="設定"
          onPress={() => navigation.navigate('Settings')}
          variant="outline"
          testID="settings-button"
        />
      </View>

      {/* 今日の日記セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今日の日記</Text>
        {todayEntry ? (
          <Button
            title="今日の日記を見る"
            onPress={() => navigation.navigate('DiaryDetail', { entryId: todayEntry.id })}
            variant="primary"
          />
        ) : (
          <Button
            title="日記を書く"
            onPress={() => navigation.navigate('DiaryInput')}
            variant="primary"
          />
        )}
      </View>

      {/* 過去の日記セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>過去の日記</Text>
        {sortedEntries.length === 0 ? (
          <Text style={styles.emptyText}>まだ日記がありません</Text>
        ) : (
          <FlatList
            data={sortedEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem
                title={item.date}
                onPress={() => navigation.navigate('DiaryDetail', { entryId: item.id })}
                testID={`diary-item-${item.id}`}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: SPACING.container,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.titleBottom,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: theme.text,
  } as TextStyle,
  section: {
    marginBottom: SPACING.sectionBottom,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONT_SIZES.sectionTitle,
    fontWeight: '600',
    color: theme.text,
    marginBottom: SPACING.sectionTitleBottom,
  } as TextStyle,
  loadingText: {
    fontSize: FONT_SIZES.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.emptyTop,
  } as TextStyle,
  errorText: {
    fontSize: FONT_SIZES.body,
    color: theme.error,
    textAlign: 'center',
    marginTop: SPACING.emptyTop,
  } as TextStyle,
  emptyText: {
    fontSize: FONT_SIZES.caption,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.emptyTop,
  } as TextStyle,
});
