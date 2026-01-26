/**
 * DiaryDetailScreen
 * 日記詳細画面 - 過去の日記閲覧/編集
 *
 * TODO (将来の改善):
 * - 削除時の確認ダイアログ
 * - 保存成功/失敗のフィードバック
 * - 日付フォーマットの改善
 * - アニメーション（編集モード切り替え）
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useDiaryStore } from '../stores/diaryStore';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Card } from '../components/Card';
import { DiaryAnswer, DiaryEntry } from '../types';

// カラー定数
const COLORS = {
  background: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  error: '#FF3B30',
};

// フォントサイズ定数
const FONT_SIZES = {
  date: 24,
  question: 16,
  answer: 16,
  body: 16,
};

// 余白定数
const SPACING = {
  container: 16,
  dateBottom: 24,
  answerBottom: 16,
  buttonSpacing: 12,
};

interface DiaryDetailScreenProps {
  entryId: string;
}

export const DiaryDetailScreen: React.FC<DiaryDetailScreenProps> = ({ entryId }) => {
  const { getEntryById, updateEntry, deleteEntry } = useDiaryStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState<{
    [questionId: string]: string | number;
  }>({});

  const entry = getEntryById(entryId);

  // エントリーが見つからない
  if (!entry || !entryId) {
    return (
      <View style={styles.container} testID="diary-detail-screen" accessibilityRole="none">
        <Text style={styles.errorText}>日記が見つかりません</Text>
      </View>
    );
  }

  // 編集モードに切り替え
  const handleEdit = () => {
    // 現在の回答を初期値として設定
    const initialAnswers: { [questionId: string]: string | number } = {};
    entry.answers.forEach((answer) => {
      initialAnswers[answer.questionId] = answer.value;
    });
    setEditedAnswers(initialAnswers);
    setIsEditing(true);
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setEditedAnswers({});
    setIsEditing(false);
  };

  // 保存
  const handleSave = async () => {
    const updatedAnswers: DiaryAnswer[] = entry.answers.map((answer) => ({
      ...answer,
      value: editedAnswers[answer.questionId] ?? answer.value,
    }));

    const updatedEntry: DiaryEntry = {
      ...entry,
      answers: updatedAnswers,
      updatedAt: new Date().toISOString(),
    };

    await updateEntry(updatedEntry);
    setIsEditing(false);
  };

  // 削除
  const handleDelete = async () => {
    await deleteEntry(entry.id);
  };

  // 回答の編集
  const handleAnswerChange = (questionId: string, value: string | number) => {
    setEditedAnswers({
      ...editedAnswers,
      [questionId]: value,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID="diary-detail-screen"
      accessibilityRole="none"
    >
      {/* 日付 */}
      <Text style={styles.date} accessibilityRole="header">
        {entry.date}
      </Text>

      {/* 回答一覧 */}
      {entry.answers.map((answer) => (
        <Card key={answer.questionId} variant="default" style={styles.answerCard}>
          <Text style={styles.questionText}>{answer.questionText}</Text>
          {isEditing ? (
            answer.type === 'rating' ? (
              <Text style={styles.answerText}>
                {editedAnswers[answer.questionId] ?? answer.value}
              </Text>
            ) : (
              <TextInput
                value={String(editedAnswers[answer.questionId] ?? answer.value)}
                onChangeText={(text) => handleAnswerChange(answer.questionId, text)}
                multiline
                testID={`answer-input-${answer.questionId}`}
              />
            )
          ) : (
            <Text style={styles.answerText}>{String(answer.value)}</Text>
          )}
        </Card>
      ))}

      {/* アクションボタン */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Button title="保存" onPress={handleSave} variant="primary" />
            <Button title="キャンセル" onPress={handleCancel} variant="outline" />
          </>
        ) : (
          <>
            <Button title="編集" onPress={handleEdit} variant="primary" />
            <Button title="削除" onPress={handleDelete} variant="outline" />
          </>
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
  date: {
    fontSize: FONT_SIZES.date,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.dateBottom,
  } as TextStyle,
  answerCard: {
    marginBottom: SPACING.answerBottom,
  } as ViewStyle,
  questionText: {
    fontSize: FONT_SIZES.question,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  } as TextStyle,
  answerText: {
    fontSize: FONT_SIZES.answer,
    color: COLORS.textSecondary,
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.dateBottom,
    gap: SPACING.buttonSpacing,
  } as ViewStyle,
  errorText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
});
