/**
 * DataManagementScreen
 * データ管理画面 - エクスポート(JSON/CSV)・全データ削除
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useDiaryStore } from '../stores/diaryStore';
import { ExportService } from '../services/export';
import { useThemeColors, ThemeColors } from '../theme';

// フォントサイズ定数
const FONT_SIZES = {
  title: 24,
  body: 16,
  caption: 14,
};

// 余白定数
const SPACING = {
  container: 16,
  titleBottom: 24,
  sectionBottom: 24,
  itemGap: 12,
};

export const DataManagementScreen: React.FC = () => {
  const { entries, deleteEntry } = useDiaryStore();
  const theme = useThemeColors();
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExportJSON = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await ExportService.exportAsJSON(entries);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'エクスポートに失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  }, [entries]);

  const handleExportCSV = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await ExportService.exportAsCSV(entries);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'エクスポートに失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  }, [entries]);

  const handleDeleteAll = useCallback(() => {
    Alert.alert(
      '全データ削除',
      'すべての日記データが削除されます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            if (entries.length === 0) return;
            setErrorMessage(null);
            setIsLoading(true);
            try {
              for (const entry of entries) {
                await deleteEntry(entry.id);
              }
            } catch (error) {
              setErrorMessage(
                error instanceof Error ? error.message : '削除に失敗しました'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, [entries, deleteEntry]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID="data-management-screen"
    >
      <Text style={styles.title} accessibilityRole="header">
        データ管理
      </Text>

      {/* エクスポートセクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>エクスポート</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportJSON}
          testID="export-json-button"
          accessibilityRole="button"
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>JSONエクスポート</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportCSV}
          testID="export-csv-button"
          accessibilityRole="button"
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>CSVエクスポート</Text>
        </TouchableOpacity>
      </View>

      {/* データ削除セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>データ削除</Text>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleDeleteAll}
          testID="delete-all-button"
          accessibilityRole="button"
          disabled={isLoading}
        >
          <Text style={styles.dangerButtonText}>全データ削除</Text>
        </TouchableOpacity>
      </View>

      {/* ローディング */}
      {isLoading && (
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color={theme.text}
          style={styles.loading}
        />
      )}

      {/* エラーメッセージ */}
      {errorMessage && (
        <Text style={styles.errorText} testID="error-message">
          {errorMessage}
        </Text>
      )}
    </ScrollView>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  } as ViewStyle,
  contentContainer: {
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: theme.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
  section: {
    marginBottom: SPACING.sectionBottom,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: SPACING.itemGap,
  } as TextStyle,
  button: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: SPACING.container,
    marginBottom: SPACING.itemGap,
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    fontSize: FONT_SIZES.body,
    color: theme.text,
    fontWeight: '500',
  } as TextStyle,
  dangerButton: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.error,
    borderRadius: 8,
    padding: SPACING.container,
    marginBottom: SPACING.itemGap,
    alignItems: 'center',
  } as ViewStyle,
  dangerButtonText: {
    fontSize: FONT_SIZES.body,
    color: theme.error,
    fontWeight: '500',
  } as TextStyle,
  loading: {
    marginTop: SPACING.container,
  } as ViewStyle,
  errorText: {
    fontSize: FONT_SIZES.caption,
    color: theme.error,
    marginTop: SPACING.itemGap,
    textAlign: 'center',
  } as TextStyle,
});
