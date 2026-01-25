/**
 * ListItemコンポーネントのテスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ListItem } from '../../src/components/ListItem';

describe('ListItem', () => {
  it('titleを表示する', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} />
    );

    expect(getByText('日記タイトル')).toBeTruthy();
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

  it('右矢印を表示する（showArrow=true時）', () => {
    const { getByText } = render(
      <ListItem title="日記タイトル" onPress={() => {}} showArrow={true} />
    );

    // 右矢印（›）が表示される
    expect(getByText('›')).toBeTruthy();
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

  it('disabled=true時に半透明で表示される', () => {
    const { getByTestId } = render(
      <ListItem
        title="日記タイトル"
        onPress={() => {}}
        disabled={true}
        testID="list-item"
      />
    );

    const listItem = getByTestId('list-item');
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
