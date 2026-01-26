/**
 * DiaryInputScreen
 * 日記入力画面 - 質問に順番に回答
 *
 * TODO (将来の改善):
 * - 音声入力の統合
 * - 下書き保存機能
 * - 回答のバリデーション
 * - アニメーション（質問の切り替え）
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useQuestionStore } from '../stores/questionStore';
import { useDiaryStore } from '../stores/diaryStore';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { DiaryEntry, DiaryAnswer } from '../types';

// カラー定数
const COLORS = {
  background: '#F5F5F5',
  white: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  error: '#FF3B30',
  primary: '#007AFF',
  selected: '#E3F2FD',
};

// フォントサイズ定数
const FONT_SIZES = {
  title: 24,
  question: 18,
  progress: 14,
  rating: 18,
  body: 16,
};

// 余白定数
const SPACING = {
  container: 16,
  questionBottom: 24,
  progressBottom: 16,
  buttonSpacing: 12,
};

export const DiaryInputScreen: React.FC = () => {
  const { questions, isLoading, error, loadQuestions, getActiveQuestions } =
    useQuestionStore();
  const { addEntry } = useDiaryStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | number }>({});

  const activeQuestions = getActiveQuestions();

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // ローディング中
  if (isLoading) {
    return (
      <View style={styles.container} testID="diary-input-screen" accessibilityRole="none">
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  // エラー
  if (error) {
    return (
      <View style={styles.container} testID="diary-input-screen" accessibilityRole="none">
        <Text style={styles.errorText}>エラー: {error}</Text>
      </View>
    );
  }

  // 質問がない
  if (activeQuestions.length === 0) {
    return (
      <View style={styles.container} testID="diary-input-screen" accessibilityRole="none">
        <Text style={styles.errorText}>質問がありません</Text>
      </View>
    );
  }

  const currentQuestion = activeQuestions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === activeQuestions.length - 1;
  const currentAnswer = answers[currentQuestion.id];

  // 次へ
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 戻る
  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 保存
  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const diaryAnswers: DiaryAnswer[] = activeQuestions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      value: answers[q.id] ?? '',
      type: q.type === 'rating' ? 'rating' : 'text',
    }));

    const entry: DiaryEntry = {
      id: `entry-${Date.now()}`,
      date: today,
      createdAt: now,
      updatedAt: now,
      answers: diaryAnswers,
    };

    await addEntry(entry);
  };

  // rating型の回答設定
  const handleRatingSelect = (rating: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: rating,
    });
  };

  // text/multiline型の回答設定
  const handleTextChange = (text: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: text,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID="diary-input-screen"
      accessibilityRole="none"
    >
      {/* タイトル */}
      <Text style={styles.title} accessibilityRole="header">
        日記を書く
      </Text>

      {/* 進捗表示 */}
      <Text style={styles.progress}>
        {currentIndex + 1} / {activeQuestions.length}
      </Text>

      {/* 質問 */}
      <Text style={styles.question}>{currentQuestion.text}</Text>

      {/* 回答入力UI */}
      {currentQuestion.type === 'rating' ? (
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              title={String(rating)}
              onPress={() => handleRatingSelect(rating)}
              variant={currentAnswer === rating ? 'primary' : 'outline'}
            />
          ))}
        </View>
      ) : (
        <TextInput
          value={String(currentAnswer ?? '')}
          onChangeText={handleTextChange}
          placeholder="ここに入力..."
          multiline={currentQuestion.type === 'multiline'}
          testID="answer-input"
        />
      )}

      {/* ナビゲーションボタン */}
      <View style={styles.navigationContainer}>
        {!isFirstQuestion && (
          <Button
            title="戻る"
            onPress={handleBack}
            variant="outline"
          />
        )}
        {isLastQuestion ? (
          <Button
            title="保存"
            onPress={handleSave}
            variant="primary"
          />
        ) : (
          <Button
            title="次へ"
            onPress={handleNext}
            variant="primary"
          />
        )}
      </View>
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
    marginBottom: SPACING.questionBottom,
  } as TextStyle,
  progress: {
    fontSize: FONT_SIZES.progress,
    color: COLORS.textSecondary,
    marginBottom: SPACING.progressBottom,
  } as TextStyle,
  question: {
    fontSize: FONT_SIZES.question,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.questionBottom,
  } as TextStyle,
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.questionBottom,
  } as ViewStyle,
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.questionBottom,
    gap: SPACING.buttonSpacing,
  } as ViewStyle,
  loadingText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
  errorText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
});
