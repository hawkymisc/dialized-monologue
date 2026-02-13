/**
 * ナビゲーション型定義
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * ルートスタックのパラメータリスト
 */
export type RootStackParamList = {
  Home: undefined;
  DiaryInput: undefined;
  DiaryDetail: { entryId: string };
  Settings: undefined;
  ReminderSettings: undefined;
  QuestionSettings: undefined;
  DataManagement: undefined;
  DisplaySettings: undefined;
};

/**
 * 各画面のProps型
 */
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DiaryInputScreenProps = NativeStackScreenProps<RootStackParamList, 'DiaryInput'>;
export type DiaryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'DiaryDetail'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
export type ReminderSettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'ReminderSettings'>;
export type QuestionSettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'QuestionSettings'>;
export type DataManagementScreenProps = NativeStackScreenProps<RootStackParamList, 'DataManagement'>;
export type DisplaySettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'DisplaySettings'>;
