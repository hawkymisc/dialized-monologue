/**
 * ReminderSettingsScreen テスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { ReminderSettingsScreen } from '../../src/screens/ReminderSettingsScreen';
import { useSettingsStore } from '../../src/stores/settingsStore';

const mockLoadSettings = jest.fn();
const mockAddReminderTime = jest.fn();
const mockRemoveReminderTime = jest.fn();
const mockToggleReminderTime = jest.fn();

jest.mock('../../src/stores/settingsStore', () => ({
  useSettingsStore: jest.fn(),
}));

const mockUseSettingsStore = useSettingsStore as unknown as jest.Mock;

const createMockStore = (reminderTimes: Array<{ hour: number; minute: number; isEnabled: boolean }> = []) => ({
  settings: { reminderTimes },
  loadSettings: mockLoadSettings,
  addReminderTime: mockAddReminderTime,
  removeReminderTime: mockRemoveReminderTime,
  toggleReminderTime: mockToggleReminderTime,
});

describe('ReminderSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSettingsStore.mockReturnValue(createMockStore());
  });

  describe('仕様検証', () => {
    it('画面タイトル「リマインダー設定」が表示される', () => {
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('リマインダー設定')).toBeTruthy();
    });

    it('画面タイトルのフォントサイズは24である', () => {
      const { getByText } = render(<ReminderSettingsScreen />);
      const style = StyleSheet.flatten(getByText('リマインダー設定').props.style);
      expect(style.fontSize).toBe(24);
    });

    it('画面タイトルのフォントウェイトは600である', () => {
      const { getByText } = render(<ReminderSettingsScreen />);
      const style = StyleSheet.flatten(getByText('リマインダー設定').props.style);
      expect(style.fontWeight).toBe('600');
    });

    it('画面背景色は#F5F5F5である', () => {
      const { getByTestId } = render(<ReminderSettingsScreen />);
      const style = StyleSheet.flatten(getByTestId('reminder-settings-screen').props.style);
      expect(style.backgroundColor).toBe('#F5F5F5');
    });

    it('リマインダーが0件の場合「リマインダーがありません」が表示される', () => {
      mockUseSettingsStore.mockReturnValue(createMockStore([]));
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('リマインダーがありません')).toBeTruthy();
    });

    it('リマインダーがある場合、時刻がHH:MM形式で表示される', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: true }])
      );
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('21:00')).toBeTruthy();
    });

    it('時刻が1桁の場合ゼロパディングされる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 7, minute: 5, isEnabled: true }])
      );
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('07:05')).toBeTruthy();
    });

    it('追加ボタンが表示される', () => {
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('add-reminder-button')).toBeTruthy();
    });

    it('追加ボタンのテキストは「リマインダーを追加」である', () => {
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('リマインダーを追加')).toBeTruthy();
    });

    it('リマインダーがある場合「リマインダーがありません」は表示されない', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: true }])
      );
      const { queryByText } = render(<ReminderSettingsScreen />);
      expect(queryByText('リマインダーがありません')).toBeNull();
    });
  });

  describe('初期化', () => {
    it('マウント時にloadSettingsが呼ばれる', () => {
      render(<ReminderSettingsScreen />);
      expect(mockLoadSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('インタラクション', () => {
    it('追加ボタンタップでaddReminderTimeがデフォルト時刻で呼ばれる', () => {
      const { getByTestId } = render(<ReminderSettingsScreen />);
      fireEvent.press(getByTestId('add-reminder-button'));
      expect(mockAddReminderTime).toHaveBeenCalledWith({
        hour: 21,
        minute: 0,
        isEnabled: true,
      });
    });

    it('削除ボタンタップでremoveReminderTimeがインデックス付きで呼ばれる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: true }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      fireEvent.press(getByTestId('delete-reminder-0'));
      expect(mockRemoveReminderTime).toHaveBeenCalledWith(0);
    });

    it('SwitchトグルでtoggleReminderTimeがインデックス付きで呼ばれる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: true }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      fireEvent(getByTestId('toggle-reminder-0'), 'valueChange', false);
      expect(mockToggleReminderTime).toHaveBeenCalledWith(0);
    });
  });

  describe('アクセシビリティ', () => {
    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('リマインダー設定').props.accessibilityRole).toBe('header');
    });

    it('追加ボタンにaccessibilityRole="button"が設定される', () => {
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('add-reminder-button').props.accessibilityRole).toBe('button');
    });

    it('SwitchにaccessibilityLabelが設定される', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 7, minute: 30, isEnabled: true }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('toggle-reminder-0').props.accessibilityLabel).toBe(
        '07:30のリマインダーを切り替え'
      );
    });

    it('削除ボタンにaccessibilityLabelが設定される', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 7, minute: 30, isEnabled: true }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('delete-reminder-0').props.accessibilityLabel).toBe(
        '07:30のリマインダーを削除'
      );
    });
  });

  describe('エッジケース', () => {
    it('複数のリマインダーが正しく表示される', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([
          { hour: 7, minute: 0, isEnabled: true },
          { hour: 12, minute: 30, isEnabled: false },
          { hour: 21, minute: 0, isEnabled: true },
        ])
      );
      const { getByText } = render(<ReminderSettingsScreen />);
      expect(getByText('07:00')).toBeTruthy();
      expect(getByText('12:30')).toBeTruthy();
      expect(getByText('21:00')).toBeTruthy();
    });

    it('複数リマインダーの2番目を削除できる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([
          { hour: 7, minute: 0, isEnabled: true },
          { hour: 21, minute: 0, isEnabled: true },
        ])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      fireEvent.press(getByTestId('delete-reminder-1'));
      expect(mockRemoveReminderTime).toHaveBeenCalledWith(1);
    });

    it('無効なリマインダーのSwitchはfalseである', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: false }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('toggle-reminder-0').props.value).toBe(false);
    });

    it('有効なリマインダーのSwitchはtrueである', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore([{ hour: 21, minute: 0, isEnabled: true }])
      );
      const { getByTestId } = render(<ReminderSettingsScreen />);
      expect(getByTestId('toggle-reminder-0').props.value).toBe(true);
    });

    it('追加ボタンを連続タップしてもaddReminderTimeが複数回呼ばれる', () => {
      const { getByTestId } = render(<ReminderSettingsScreen />);
      const button = getByTestId('add-reminder-button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      expect(mockAddReminderTime).toHaveBeenCalledTimes(3);
    });
  });
});
