/**
 * ListItemコンポーネントのテスト
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ListItem } from '../../src/components/ListItem';

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
    expect(style.color).toBe('#999999');
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
});
