/**
 * QuestionSettingsScreen
 * 質問設定画面 - 質問の有効/無効切り替え・削除・デフォルトリセット
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useQuestionStore } from '../stores/questionStore';
import { QuestionType } from '../types';
import { useThemeColors, ThemeColors } from '../theme';

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

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: 'テキスト',
  multiline: '複数行テキスト',
  rating: '5段階評価',
  choice: '選択式',
};

export const QuestionSettingsScreen: React.FC = () => {
  const theme = useThemeColors();
  const styles = createStyles(theme);
  const {
    questions,
    loadQuestions,
    deleteQuestion,
    toggleQuestionActive,
    resetToDefaults,
  } = useQuestionStore();

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleResetToDefaults = () => {
    Alert.alert('確認', '質問をデフォルトに戻しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'リセット', style: 'destructive', onPress: () => resetToDefaults() },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      testID="question-settings-screen"
    >
      <Text style={styles.title} accessibilityRole="header">
        質問設定
      </Text>

      {questions.length === 0 ? (
        <Text style={styles.emptyText}>質問がありません</Text>
      ) : (
        questions.map((question) => (
          <View key={question.id} style={styles.questionItem}>
            <View style={styles.questionContent}>
              <Text style={styles.questionText}>{question.text}</Text>
              <Text style={styles.questionType}>
                {QUESTION_TYPE_LABELS[question.type]}
              </Text>
            </View>
            <View style={styles.questionActions}>
              <Switch
                testID={`question-switch-${question.id}`}
                value={question.isActive}
                onValueChange={() => toggleQuestionActive(question.id)}
                trackColor={{ false: '#ccc', true: theme.primary }}
              />
              <TouchableOpacity
                testID={`question-delete-${question.id}`}
                accessibilityLabel={`${question.text}を削除`}
                accessibilityRole="button"
                onPress={() => deleteQuestion(question.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetToDefaults}
        accessibilityRole="button"
      >
        <Text style={styles.resetButtonText}>デフォルトにリセット</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: theme.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
  emptyText: {
    fontSize: FONT_SIZES.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
  questionItem: {
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    padding: SPACING.container,
    marginBottom: SPACING.itemGap,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  questionContent: {
    flex: 1,
    marginRight: SPACING.itemGap,
  } as ViewStyle,
  questionText: {
    fontSize: FONT_SIZES.body,
    color: theme.text,
    marginBottom: 4,
  } as TextStyle,
  questionType: {
    fontSize: FONT_SIZES.caption,
    color: theme.textSecondary,
  } as TextStyle,
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.itemGap,
  } as ViewStyle,
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: theme.error,
  } as ViewStyle,
  deleteButtonText: {
    fontSize: FONT_SIZES.caption,
    color: theme.cardBackground,
    fontWeight: '600',
  } as TextStyle,
  resetButton: {
    marginTop: SPACING.container,
    padding: SPACING.container,
    borderRadius: 8,
    backgroundColor: theme.cardBackground,
    alignItems: 'center',
  } as ViewStyle,
  resetButtonText: {
    fontSize: FONT_SIZES.body,
    color: theme.primary,
    fontWeight: '600',
  } as TextStyle,
});
