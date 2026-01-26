/**
 * SettingsScreen テスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from '../../src/screens/SettingsScreen';

describe('SettingsScreen', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('仕様検証', () => {
    it('画面タイトルが表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('設定')).toBeTruthy();
    });

    it('リマインダー設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('リマインダー設定')).toBeTruthy();
    });

    it('質問設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('質問設定')).toBeTruthy();
    });

    it('データ管理項目が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('データ管理')).toBeTruthy();
    });

    it('表示設定項目が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('表示設定')).toBeTruthy();
    });
  });

  describe('ナビゲーション', () => {
    it('リマインダー設定をタップするとonNavigateが呼ばれる', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      const item = getByText('リマインダー設定');

      fireEvent.press(item);

      expect(mockOnNavigate).toHaveBeenCalledWith('ReminderSettings');
    });

    it('質問設定をタップするとonNavigateが呼ばれる', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      const item = getByText('質問設定');

      fireEvent.press(item);

      expect(mockOnNavigate).toHaveBeenCalledWith('QuestionSettings');
    });

    it('データ管理をタップするとonNavigateが呼ばれる', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      const item = getByText('データ管理');

      fireEvent.press(item);

      expect(mockOnNavigate).toHaveBeenCalledWith('DataManagement');
    });

    it('表示設定をタップするとonNavigateが呼ばれる', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      const item = getByText('表示設定');

      fireEvent.press(item);

      expect(mockOnNavigate).toHaveBeenCalledWith('DisplaySettings');
    });
  });

  describe('説明テキスト', () => {
    it('リマインダー設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('通知時刻の設定')).toBeTruthy();
    });

    it('質問設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('質問の追加・編集・削除')).toBeTruthy();
    });

    it('データ管理に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('エクスポート・削除')).toBeTruthy();
    });

    it('表示設定に説明が表示される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByText('ダークモード設定')).toBeTruthy();
    });
  });

  describe('アクセシビリティ', () => {
    it('画面全体にaccessibilityRole="none"が設定される', () => {
      const { getByTestId } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByTestId('settings-screen')).toHaveProp('accessibilityRole', 'none');
    });

    it('画面タイトルにaccessibilityRole="header"が設定される', () => {
      const { getByText } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      const title = getByText('設定');
      expect(title.props.accessibilityRole).toBe('header');
    });

    it('各設定項目にaccessibilityRole="button"が設定される', () => {
      const { getByTestId } = render(<SettingsScreen onNavigate={mockOnNavigate} />);
      expect(getByTestId('setting-item-reminder')).toHaveProp(
        'accessibilityRole',
        'button'
      );
    });
  });

  describe('エッジケース', () => {
    it('onNavigateがundefinedでもクラッシュしない', () => {
      expect(() => {
        render(<SettingsScreen onNavigate={undefined as any} />);
      }).not.toThrow();
    });

    it('onNavigateが呼ばれたときにエラーが発生してもクラッシュしない', () => {
      const errorNavigate = jest.fn(() => {
        throw new Error('Navigation error');
      });

      const { getByText } = render(<SettingsScreen onNavigate={errorNavigate} />);

      expect(() => {
        fireEvent.press(getByText('リマインダー設定'));
      }).not.toThrow();
    });
  });
});
