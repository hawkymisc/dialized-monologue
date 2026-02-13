/**
 * DataManagementScreen テスト
 */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, StyleSheet } from 'react-native';
import { DataManagementScreen } from '../../src/screens/DataManagementScreen';
import { useDiaryStore } from '../../src/stores/diaryStore';
import { ExportService } from '../../src/services/export';
import type { DiaryEntry } from '../../src/types';

jest.mock('../../src/stores/diaryStore');
jest.mock('../../src/services/export', () => ({
  ExportService: {
    exportAsJSON: jest.fn(),
    exportAsCSV: jest.fn(),
  },
}));
// Alert.alertをspyOnでモック
const mockAlert = jest.spyOn(Alert, 'alert');

const mockUseDiaryStore = useDiaryStore as unknown as jest.Mock;
const mockExportAsJSON = ExportService.exportAsJSON as jest.Mock;
const mockExportAsCSV = ExportService.exportAsCSV as jest.Mock;

const createMockEntry = (id: string, date: string): DiaryEntry => ({
  id,
  date,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  answers: [
    {
      questionId: 'q1',
      questionText: '今日の気分は？',
      value: '良い',
      type: 'text',
    },
  ],
});

const defaultStoreState = {
  entries: [
    createMockEntry('1', '2025-01-01'),
    createMockEntry('2', '2025-01-02'),
  ],
  loadEntries: jest.fn(),
  deleteEntry: jest.fn().mockResolvedValue(undefined),
};

describe('DataManagementScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDiaryStore.mockReturnValue(defaultStoreState);
    mockExportAsJSON.mockResolvedValue(undefined);
    mockExportAsCSV.mockResolvedValue(undefined);
  });

  describe('仕様検証', () => {
    it('画面タイトル「データ管理」が表示される', () => {
      const { getByText } = render(<DataManagementScreen />);
      expect(getByText('データ管理')).toBeTruthy();
    });

    it('タイトルのフォントサイズは24である', () => {
      const { getByText } = render(<DataManagementScreen />);
      const style = StyleSheet.flatten(getByText('データ管理').props.style);
      expect(style.fontSize).toBe(24);
    });

    it('タイトルのフォントウェイトは600である', () => {
      const { getByText } = render(<DataManagementScreen />);
      const style = StyleSheet.flatten(getByText('データ管理').props.style);
      expect(style.fontWeight).toBe('600');
    });

    it('背景色は#F5F5F5である', () => {
      const { getByTestId } = render(<DataManagementScreen />);
      const style = StyleSheet.flatten(getByTestId('data-management-screen').props.style);
      expect(style.backgroundColor).toBe('#F5F5F5');
    });

    it('JSONエクスポートボタンが表示される', () => {
      const { getByTestId } = render(<DataManagementScreen />);
      expect(getByTestId('export-json-button')).toBeTruthy();
    });

    it('CSVエクスポートボタンが表示される', () => {
      const { getByTestId } = render(<DataManagementScreen />);
      expect(getByTestId('export-csv-button')).toBeTruthy();
    });

    it('全データ削除ボタンが表示される', () => {
      const { getByTestId } = render(<DataManagementScreen />);
      expect(getByTestId('delete-all-button')).toBeTruthy();
    });

    it('削除ボタンの文字色は#FF3B30（赤）である', () => {
      const { getByText } = render(<DataManagementScreen />);
      const text = getByText('全データ削除');
      const style = StyleSheet.flatten(text.props.style);
      expect(style.color).toBe('#FF3B30');
    });
  });

  describe('インタラクション', () => {
    it('JSONエクスポートボタンタップでExportService.exportAsJSONが呼ばれる', async () => {
      const { getByTestId } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-json-button'));
      });

      expect(mockExportAsJSON).toHaveBeenCalledWith(defaultStoreState.entries);
    });

    it('CSVエクスポートボタンタップでExportService.exportAsCSVが呼ばれる', async () => {
      const { getByTestId } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-csv-button'));
      });

      expect(mockExportAsCSV).toHaveBeenCalledWith(defaultStoreState.entries);
    });

    it('削除ボタンタップでAlert.alertが呼ばれる', () => {
      const { getByTestId } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      expect(Alert.alert).toHaveBeenCalledWith(
        '全データ削除',
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({ text: 'キャンセル' }),
          expect.objectContaining({ text: '削除' }),
        ])
      );
    });

    it('Alert確認後に全エントリーが削除される', async () => {
      const mockDeleteEntry = jest.fn().mockResolvedValue(undefined);
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        deleteEntry: mockDeleteEntry,
      });

      const { getByTestId } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      // Alert.alertの第3引数（ボタン配列）から「削除」ボタンのonPressを取得
      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertArgs[2];
      const deleteButton = buttons.find(
        (b: { text: string }) => b.text === '削除'
      );

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(mockDeleteEntry).toHaveBeenCalledTimes(2);
      expect(mockDeleteEntry).toHaveBeenCalledWith('1');
      expect(mockDeleteEntry).toHaveBeenCalledWith('2');
    });

    it('エクスポート中はローディング表示される', async () => {
      // exportAsJSONが解決しないPromiseを返す
      let resolveExport: () => void;
      mockExportAsJSON.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        })
      );

      const { getByTestId, queryByTestId } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-json-button'));
      });

      // ローディングインジケータが表示される
      expect(queryByTestId('loading-indicator')).toBeTruthy();

      // エクスポート完了
      await act(async () => {
        resolveExport!();
      });

      // ローディングが消える
      expect(queryByTestId('loading-indicator')).toBeNull();
    });

    it('削除中はローディング表示される', async () => {
      let resolveDelete: () => void;
      const mockDeleteEntry = jest.fn().mockReturnValue(
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        })
      );
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        deleteEntry: mockDeleteEntry,
      });

      const { getByTestId, queryByTestId } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertArgs[2];
      const deleteButton = buttons.find(
        (b: { text: string }) => b.text === '削除'
      );

      await act(async () => {
        deleteButton.onPress();
      });

      expect(queryByTestId('loading-indicator')).toBeTruthy();

      await act(async () => {
        resolveDelete!();
      });

      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  });

  describe('アクセシビリティ', () => {
    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<DataManagementScreen />);
      expect(getByText('データ管理').props.accessibilityRole).toBe('header');
    });

    it('各ボタンにaccessibilityRole="button"が設定される', () => {
      const { getByTestId } = render(<DataManagementScreen />);
      expect(getByTestId('export-json-button').props.accessibilityRole).toBe('button');
      expect(getByTestId('export-csv-button').props.accessibilityRole).toBe('button');
      expect(getByTestId('delete-all-button').props.accessibilityRole).toBe('button');
    });
  });

  describe('エッジケース', () => {
    it('エントリーが0件の場合もJSONエクスポートが動作する', async () => {
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        entries: [],
      });

      const { getByTestId } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-json-button'));
      });

      expect(mockExportAsJSON).toHaveBeenCalledWith([]);
    });

    it('エントリーが0件の場合もCSVエクスポートが動作する', async () => {
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        entries: [],
      });

      const { getByTestId } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-csv-button'));
      });

      expect(mockExportAsCSV).toHaveBeenCalledWith([]);
    });

    it('エントリーが0件の場合に削除ボタンを押しても削除が呼ばれない', async () => {
      const mockDeleteEntry = jest.fn();
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        entries: [],
        deleteEntry: mockDeleteEntry,
      });

      const { getByTestId } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertArgs[2];
      const deleteButton = buttons.find(
        (b: { text: string }) => b.text === '削除'
      );

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(mockDeleteEntry).not.toHaveBeenCalled();
    });

    it('JSONエクスポートエラー時にエラーメッセージが表示される', async () => {
      mockExportAsJSON.mockRejectedValue(new Error('エクスポートに失敗しました'));

      const { getByTestId, findByText } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-json-button'));
      });

      expect(await findByText('エクスポートに失敗しました')).toBeTruthy();
    });

    it('CSVエクスポートエラー時にエラーメッセージが表示される', async () => {
      mockExportAsCSV.mockRejectedValue(new Error('エクスポートに失敗しました'));

      const { getByTestId, findByText } = render(<DataManagementScreen />);

      await act(async () => {
        fireEvent.press(getByTestId('export-csv-button'));
      });

      expect(await findByText('エクスポートに失敗しました')).toBeTruthy();
    });

    it('削除エラー時にエラーメッセージが表示される', async () => {
      const mockDeleteEntry = jest.fn().mockRejectedValue(new Error('削除に失敗しました'));
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        deleteEntry: mockDeleteEntry,
      });

      const { getByTestId, findByText } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertArgs[2];
      const deleteButton = buttons.find(
        (b: { text: string }) => b.text === '削除'
      );

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(await findByText('削除に失敗しました')).toBeTruthy();
    });

    it('Alertのキャンセルボタンを押しても削除が実行されない', () => {
      const mockDeleteEntry = jest.fn();
      mockUseDiaryStore.mockReturnValue({
        ...defaultStoreState,
        deleteEntry: mockDeleteEntry,
      });

      const { getByTestId } = render(<DataManagementScreen />);

      fireEvent.press(getByTestId('delete-all-button'));

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertArgs[2];
      const cancelButton = buttons.find(
        (b: { text: string }) => b.text === 'キャンセル'
      );

      // キャンセルボタンにはonPressがないか、あっても何もしない
      if (cancelButton.onPress) {
        cancelButton.onPress();
      }

      expect(mockDeleteEntry).not.toHaveBeenCalled();
    });
  });
});
