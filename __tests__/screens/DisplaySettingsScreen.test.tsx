/**
 * DisplaySettingsScreen テスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { DisplaySettingsScreen } from '../../src/screens/DisplaySettingsScreen';

const mockSetDarkMode = jest.fn();
const mockLoadSettings = jest.fn();

jest.mock('../../src/stores/settingsStore', () => ({
  useSettingsStore: jest.fn(),
}));

import { useSettingsStore } from '../../src/stores/settingsStore';

const mockUseSettingsStore = useSettingsStore as jest.MockedFunction<
  typeof useSettingsStore
>;

const createMockStore = (overrides: Partial<{
  settings: { isDarkMode: boolean };
  loadSettings: jest.Mock;
  setDarkMode: jest.Mock;
}> = {}) => ({
  settings: { isDarkMode: false },
  loadSettings: mockLoadSettings,
  setDarkMode: mockSetDarkMode,
  ...overrides,
});

describe('DisplaySettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSettingsStore.mockReturnValue(createMockStore() as any);
  });

  describe('仕様検証', () => {
    it('画面タイトル「表示設定」が表示される', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      expect(getByText('表示設定')).toBeTruthy();
    });

    it('タイトルのフォントサイズは24、太字である', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(getByText('表示設定').props.style);
      expect(style.fontSize).toBe(24);
      expect(style.fontWeight).toBe('600');
    });

    it('タイトルの色は#000000である', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(getByText('表示設定').props.style);
      expect(style.color).toBe('#000000');
    });

    it('タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      expect(getByText('表示設定').props.accessibilityRole).toBe('header');
    });

    it('ダークモードのラベルが表示される', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      expect(getByText('ダークモード')).toBeTruthy();
    });

    it('ダークモードラベルのフォントサイズは16である', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(getByText('ダークモード').props.style);
      expect(style.fontSize).toBe(16);
    });

    it('Switchコンポーネントが表示される', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      expect(getByTestId('dark-mode-switch')).toBeTruthy();
    });

    it('コンテナの背景色は#F5F5F5である', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(
        getByTestId('display-settings-screen').props.style
      );
      expect(style.backgroundColor).toBe('#F5F5F5');
    });

    it('コンテナのpaddingは16である', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(
        getByTestId('display-settings-screen').props.style
      );
      expect(style.padding).toBe(16);
    });

    it('タイトルのmarginBottomは24である', () => {
      const { getByText } = render(<DisplaySettingsScreen />);
      const style = StyleSheet.flatten(getByText('表示設定').props.style);
      expect(style.marginBottom).toBe(24);
    });
  });

  describe('インタラクション', () => {
    it('isDarkMode=false時にSwitch切り替えでsetDarkMode(true)が呼ばれる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore({ settings: { isDarkMode: false } }) as any
      );
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');

      fireEvent(switchComponent, 'valueChange', true);

      expect(mockSetDarkMode).toHaveBeenCalledWith(true);
    });

    it('isDarkMode=true時にSwitch切り替えでsetDarkMode(false)が呼ばれる', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore({ settings: { isDarkMode: true } }) as any
      );
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');

      fireEvent(switchComponent, 'valueChange', false);

      expect(mockSetDarkMode).toHaveBeenCalledWith(false);
    });

    it('マウント時にloadSettingsが呼ばれる', () => {
      render(<DisplaySettingsScreen />);
      expect(mockLoadSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('状態の反映', () => {
    it('isDarkMode=falseのときSwitchのvalueがfalseである', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore({ settings: { isDarkMode: false } }) as any
      );
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');
      expect(switchComponent.props.value).toBe(false);
    });

    it('isDarkMode=trueのときSwitchのvalueがtrueである', () => {
      mockUseSettingsStore.mockReturnValue(
        createMockStore({ settings: { isDarkMode: true } }) as any
      );
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');
      expect(switchComponent.props.value).toBe(true);
    });
  });

  describe('エッジケース', () => {
    it('初期状態のデフォルト値はisDarkMode=falseである', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');
      expect(switchComponent.props.value).toBe(false);
    });

    it('setDarkModeが連続で呼ばれても正常に動作する', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');

      fireEvent(switchComponent, 'valueChange', true);
      fireEvent(switchComponent, 'valueChange', false);
      fireEvent(switchComponent, 'valueChange', true);

      expect(mockSetDarkMode).toHaveBeenCalledTimes(3);
      expect(mockSetDarkMode).toHaveBeenNthCalledWith(1, true);
      expect(mockSetDarkMode).toHaveBeenNthCalledWith(2, false);
      expect(mockSetDarkMode).toHaveBeenNthCalledWith(3, true);
    });
  });

  describe('アクセシビリティ', () => {
    it('SwitchにaccessibilityLabelが設定される', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');
      expect(switchComponent.props.accessibilityLabel).toBe(
        'ダークモード切り替え'
      );
    });

    it('SwitchにaccessibilityRole="switch"が設定される', () => {
      const { getByTestId } = render(<DisplaySettingsScreen />);
      const switchComponent = getByTestId('dark-mode-switch');
      expect(switchComponent.props.accessibilityRole).toBe('switch');
    });
  });
});
