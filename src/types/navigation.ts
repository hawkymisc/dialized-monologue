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
};

/**
 * 各画面のProps型
 */
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DiaryInputScreenProps = NativeStackScreenProps<RootStackParamList, 'DiaryInput'>;
export type DiaryDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'DiaryDetail'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
