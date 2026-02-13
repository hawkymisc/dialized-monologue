/**
 * ListItemコンポーネントのテスト
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ListItem } from '../../src/components/ListItem';
import { LIGHT_THEME } from '../../src/theme';

// テーマをモック
jest.mock('../../src/theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#007AFF',
    error: '#FF3B30',
    white: '#FFFFFF',
    selected: '#E3F2FD',
  })),
  LIGHT_THEME: {
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#007AFF',
    error: '#FF3B30',
    white: '#FFFFFF',
    selected: '#E3F2FD',
  },
  DARK_THEME: {
    background: '#1A1A1A',
    cardBackground: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#3A3A3A',
    primary: '#0A84FF',
    error: '#FF453A',
    white: '#1A1A1A',
    selected: '#1E3A5F',
  },
}));

describe('ListItem', () => {
  it('titleを表示する', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} />
    );

    expect(getByText('日記タイトル')).toBeTruthy();
  });

  it('titleのスタイル（16px、太字、黒）が適用される', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} />
    );

    const titleElement = getByText('日記タイトル');
    const style = StyleSheet.flatten(titleElement.props.style);

    expect(style.fontSize).toBe(16);
    expect(style.fontWeight).toBe('600');
    expect(style.color).toBe('#000000');
  });

  it('subtitleを表示する（指定時）', () => {
    const { getByText } = render(
      <ListItem
        title="日記タイトル"
        subtitle="2025-01-25"
        onPress={() => {}}
      />
    );

    expect(getByText('2025-01-25')).toBeTruthy();
  });

  it('subtitleのスタイル（14px、グレー）が適用される', () => {
    const { getByText } = render(
      <ListItem
        title="日記タイトル"
        subtitle="2025-01-25"
        onPress={() => {}}
      />
    );

    const subtitleElement = getByText('2025-01-25');
    const style = StyleSheet.flatten(subtitleElement.props.style);

    expect(style.fontSize).toBe(14);
    expect(style.color).toBe('#666666');
  });

  it('コンテナのスタイル（最小高さ56、パディング、背景色）が適用される', () => {
    const { getByTestId } = render(
      <ListItem title="日記タイトル" onPress={() => {}} testID="list-item" />
    );

    const container = getByTestId('list-item');
    const style = StyleSheet.flatten(container.props.style);

    expect(style.minHeight).toBe(56);
    expect(style.paddingHorizontal).toBe(16);
    expect(style.paddingVertical).toBe(12);
    expect(style.backgroundColor).toBe('#FFFFFF');
    expect(style.borderBottomWidth).toBe(1);
    expect(style.borderBottomColor).toBe('#E0E0E0');
  });

  it('右矢印を表示する（showArrow=true時）', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} showArrow={true} />
    );

    // 右矢印（›）が表示される
    expect(getByText('›')).toBeTruthy();
  });

  it('右矢印のスタイル（20px、グレー）が適用される', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} showArrow={true} />
    );

    const arrowElement = getByText('›');
    const style = StyleSheet.flatten(arrowElement.props.style);

    expect(style.fontSize).toBe(20);
    expect(style.color).toBe(LIGHT_THEME.textSecondary);
  });

  it('右矢印を非表示にする（showArrow=false時）', () => {
    const { queryByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} showArrow={false} />
    );

    // 右矢印が表示されない
    expect(queryByText('›')).toBeNull();
  });

  it('タップ時にonPressが呼ばれる', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ListItem title="日記タイトル" onPress={onPress} testID="list-item" />
    );

    fireEvent.press(getByTestId('list-item'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled=true時にonPressが呼ばれない', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ListItem
        title="日記タイトル"
        onPress={onPress}
        disabled={true}
        testID="list-item"
      />
    );

    fireEvent.press(getByTestId('list-item'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('disabled=true時にopacity 0.5で半透明になる', () => {
    const { getByTestId } = render(
      <ListItem
        title="日記タイトル"
        onPress={() => {}}
        disabled={true}
        testID="list-item"
      />
    );

    const listItem = getByTestId('list-item');
    const style = StyleSheet.flatten(listItem.props.style);

    expect(style.opacity).toBe(0.5);
    expect(listItem.props.accessibilityState?.disabled).toBe(true);
  });

  it('testIDが正しく設定される', () => {
    const { getByTestId } = render(
      <ListItem
        title="日記タイトル"
        onPress={() => {}}
        testID="custom-list-item"
      />
    );

    const listItem = getByTestId('custom-list-item');
    expect(listItem).toBeTruthy();
  });

  it('accessibilityRole="button"が設定される', () => {
    const { getByTestId } = render(
      <ListItem title="日記タイトル" onPress={() => {}} testID="list-item" />
    );

    const listItem = getByTestId('list-item');
    expect(listItem.props.accessibilityRole).toBe('button');
  });

  it('accessibilityLabelにtitleが反映される', () => {
    const { getByTestId } = render(
      <ListItem title="日記タイトル" onPress={() => {}} testID="list-item" />
    );

    const listItem = getByTestId('list-item');
    expect(listItem.props.accessibilityLabel).toBe('日記タイトル');
  });

  it('accessibilityHintにsubtitleが反映される', () => {
    const { getByTestId } = render(
      <ListItem
        title="日記タイトル"
        subtitle="2025-01-25"
        onPress={() => {}}
        testID="list-item"
      />
    );

    const listItem = getByTestId('list-item');
    expect(listItem.props.accessibilityHint).toBe('2025-01-25');
  });

  // エッジケース・異常系テスト
  describe('エッジケース', () => {
    it('titleが空文字列でもレンダリングできる', () => {
      const { getByTestId } = render(
        <ListItem title="" onPress={() => {}} testID="list-item" />
      );

      expect(getByTestId('list-item')).toBeTruthy();
    });

    it('titleが非常に長い文字列でもレンダリングできる', () => {
      const longTitle = 'A'.repeat(1000);
      const { getByText } = render(
        <ListItem title={longTitle} onPress={() => {}} />
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it('subtitleが空文字列の場合は表示されない', () => {
      const { queryByText, getByText } = render(
        <ListItem title="タイトル" subtitle="" onPress={() => {}} />
      );

      expect(getByText('タイトル')).toBeTruthy();
      // 空のsubtitleは表示されない（subtitle && <Text>の条件により）
      expect(queryByText('')).toBeNull();
    });

    it('subtitleがundefinedの場合は表示されない', () => {
      const { getByTestId } = render(
        <ListItem title="タイトル" onPress={() => {}} testID="list-item" />
      );

      // accessibilityHintもundefinedになる
      const listItem = getByTestId('list-item');
      expect(listItem.props.accessibilityHint).toBeUndefined();
    });

    it('disabled=true かつ showArrow=false の組み合わせが正常に動作する', () => {
      const onPress = jest.fn();
      const { getByTestId, queryByText } = render(
        <ListItem
          title="タイトル"
          onPress={onPress}
          disabled={true}
          showArrow={false}
          testID="list-item"
        />
      );

      // タップできない
      fireEvent.press(getByTestId('list-item'));
      expect(onPress).not.toHaveBeenCalled();

      // 矢印が表示されない
      expect(queryByText('›')).toBeNull();

      // 半透明になる
      const style = StyleSheet.flatten(getByTestId('list-item').props.style);
      expect(style.opacity).toBe(0.5);
    });

    it('testIDなしでもレンダリングできる', () => {
      const { getByText } = render(
        <ListItem title="タイトル" onPress={() => {}} />
      );

      expect(getByText('タイトル')).toBeTruthy();
    });

    it('カスタムaccessibilityLabelが適用される', () => {
      const { getByTestId } = render(
        <ListItem
          title="タイトル"
          onPress={() => {}}
          accessibilityLabel="日記エントリーを開く"
          testID="list-item"
        />
      );

      const listItem = getByTestId('list-item');
      expect(listItem.props.accessibilityLabel).toBe('日記エントリーを開く');
    });

    it('accessibilityLabel未指定時はtitleが使用される', () => {
      const { getByTestId } = render(
        <ListItem
          title="日記タイトル"
          onPress={() => {}}
          testID="list-item"
        />
      );

      const listItem = getByTestId('list-item');
      expect(listItem.props.accessibilityLabel).toBe('日記タイトル');
    });

    it('onPressを複数回連続で呼んでも正常に動作する', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <ListItem title="タイトル" onPress={onPress} testID="list-item" />
      );

      const listItem = getByTestId('list-item');
      fireEvent.press(listItem);
      fireEvent.press(listItem);
      fireEvent.press(listItem);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('showArrowのデフォルト値はtrueである', () => {
      const { getByText } = render(
        <ListItem title="タイトル" onPress={() => {}} />
      );

      // showArrow未指定でも矢印が表示される
      expect(getByText('›')).toBeTruthy();
    });

    it('subtitle と showArrow の組み合わせが正常に動作する', () => {
      const { getByText } = render(
        <ListItem
          title="タイトル"
          subtitle="サブタイトル"
          onPress={() => {}}
          showArrow={true}
        />
      );

      expect(getByText('タイトル')).toBeTruthy();
      expect(getByText('サブタイトル')).toBeTruthy();
      expect(getByText('›')).toBeTruthy();
    });

    it('日本語の長いタイトルとsubtitleが正常に表示される', () => {
      const { getByText } = render(
        <ListItem
          title="今日はとても良い天気でしたので、散歩に出かけました"
          subtitle="2025年1月25日（土）晴れ"
          onPress={() => {}}
        />
      );

      expect(getByText('今日はとても良い天気でしたので、散歩に出かけました')).toBeTruthy();
      expect(getByText('2025年1月25日（土）晴れ')).toBeTruthy();
    });
  });
});
