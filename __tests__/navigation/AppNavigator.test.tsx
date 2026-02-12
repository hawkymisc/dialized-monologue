/**
 * AppNavigator テスト
 * Stack Navigatorベースのナビゲーション構成を検証
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from '../../src/navigation/AppNavigator';

// ストアのモック
jest.mock('../../src/stores/diaryStore', () => ({
  useDiaryStore: () => ({
    entries: [],
    isLoading: false,
    error: null,
    loadEntries: jest.fn(),
    getEntryByDate: jest.fn(() => null),
    getEntryById: jest.fn(() => null),
    addEntry: jest.fn(),
    updateEntry: jest.fn(),
    deleteEntry: jest.fn(),
  }),
}));

jest.mock('../../src/stores/questionStore', () => ({
  useQuestionStore: () => ({
    questions: [],
    isLoading: false,
    error: null,
    loadQuestions: jest.fn(),
    getActiveQuestions: jest.fn(() => []),
  }),
}));

describe('AppNavigator', () => {
  describe('初期レンダリング', () => {
    it('レンダリングできる', () => {
      const { toJSON } = render(<AppNavigator />);
      expect(toJSON()).not.toBeNull();
    });

    it('初期画面としてHomeScreenが表示される', () => {
      const { getByTestId } = render(<AppNavigator />);
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    it('DiaryInputScreenは初期状態では表示されない', () => {
      const { queryByTestId } = render(<AppNavigator />);
      expect(queryByTestId('diary-input-screen')).toBeNull();
    });

    it('DiaryDetailScreenは初期状態では表示されない', () => {
      const { queryByTestId } = render(<AppNavigator />);
      expect(queryByTestId('diary-detail-screen')).toBeNull();
    });

    it('SettingsScreenは初期状態では表示されない', () => {
      const { queryByTestId } = render(<AppNavigator />);
      expect(queryByTestId('settings-screen')).toBeNull();
    });
  });

  describe('画面登録', () => {
    it('HomeScreenが登録されている', () => {
      const { getByTestId } = render(<AppNavigator />);
      expect(getByTestId('home-screen')).toBeTruthy();
    });
  });

  describe('ヘッダータイトル', () => {
    it('Home画面のヘッダータイトルが「日記」である', () => {
      const { getByText } = render(<AppNavigator />);
      expect(getByText('日記')).toBeTruthy();
    });
  });

  describe('NavigationContainer', () => {
    it('NavigationContainerでラップされている', () => {
      // NavigationContainerが二重にラップされるとエラーになることで検証
      expect(() => {
        render(
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        );
      }).toThrow();
    });
  });
});
