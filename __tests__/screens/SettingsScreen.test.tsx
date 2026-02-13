/**
 * SettingsScreen テスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from '../../src/screens/SettingsScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('仕様検証', () => {
    it('画面タイトルが表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('設定')).toBeTruthy();
    });

    it('リマインダー設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('リマインダー設定')).toBeTruthy();
    });

    it('質問設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('質問設定')).toBeTruthy();
    });

    it('データ管理項目が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('データ管理')).toBeTruthy();
    });

    it('表示設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('表示設定')).toBeTruthy();
    });
  });

  describe('ナビゲーション', () => {
    it('リマインダー設定をタップするとReminderSettingsに遷移する', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('リマインダー設定'));
      expect(mockNavigate).toHaveBeenCalledWith('ReminderSettings');
    });

    it('質問設定をタップするとQuestionSettingsに遷移する', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('質問設定'));
      expect(mockNavigate).toHaveBeenCalledWith('QuestionSettings');
    });

    it('データ管理をタップするとDataManagementに遷移する', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('データ管理'));
      expect(mockNavigate).toHaveBeenCalledWith('DataManagement');
    });

    it('表示設定をタップするとDisplaySettingsに遷移する', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('表示設定'));
      expect(mockNavigate).toHaveBeenCalledWith('DisplaySettings');
    });
  });

  describe('説明テキスト', () => {
    it('リマインダー設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('通知時刻の設定')).toBeTruthy();
    });

    it('質問設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('質問の追加・編集・削除')).toBeTruthy();
    });

    it('データ管理に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('エクスポート・削除')).toBeTruthy();
    });

    it('表示設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('ダークモード設定')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('画面全体にaccessibilityRole="none"が設定される', () => {
      const { getByTestId } = render(<SettingsScreen />);
      expect(getByTestId('settings-screen')).toHaveProp('accessibilityRole', 'none');
    });

    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<SettingsScreen />);
      const title = getByText('設定');
      expect(title.props.accessibilityRole).toBe('header');
    });

    it('各設定項目にaccessibilityRole="button"が設定される', () => {
      const { getByTestId } = render(<SettingsScreen />);
      expect(getByTestId('setting-item-reminder')).toHaveProp(
        'accessibilityRole',
        'button'
      );
    });
  });

  describe('エッジケース', () => {
    it('設定項目を連続でタップしてもnavigateが複数回呼ばれる', () => {
      const { getByText } = render(<SettingsScreen />);

      const item = getByText('リマインダー設定');
      fireEvent.press(item);
      fireEvent.press(item);
      fireEvent.press(item);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('ReminderSettings');
    });
  });
});
