/**
 * Cardコンポーネントのテスト
 */
import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../../src/components/Card';

describe('Card', () => {
  it('子要素を正しくレンダリングする', () => {
    const { getByText } = render(
      <Card>
        <Text>テストコンテンツ</Text>
      </Card>
    );

    expect(getByText('テストコンテンツ')).toBeTruthy();
  });

  it('基本スタイル（背景色、角丸、パディング）が適用される', () => {
    const { getByTestId } = render(
      <Card testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    const style = StyleSheet.flatten(card.props.style);

    expect(style.backgroundColor).toBe('#FFFFFF');
    expect(style.borderRadius).toBe(8);
    expect(style.padding).toBe(16);
  });

  it('variant="default"で枠線スタイル（太さ1、色#CCCCCC）が適用される', () => {
    const { getByTestId } = render(
      <Card variant="default" testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    const style = StyleSheet.flatten(card.props.style);

    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe('#CCCCCC');
    // Viewとしてレンダリングされる（onPressなし）
    expect(card.type).toBe('View');
  });

  it('variant="elevated"でelevationスタイルが適用される', () => {
    const { getByTestId } = render(
      <Card variant="elevated" testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    const style = StyleSheet.flatten(card.props.style);

    // プラットフォームに応じたスタイルを確認
    if (Platform.OS === 'ios') {
      expect(style.shadowColor).toBe('#000000');
      expect(style.shadowOpacity).toBe(0.1);
      expect(style.shadowRadius).toBe(4);
    } else if (Platform.OS === 'android') {
      expect(style.elevation).toBe(4);
    }
  });

  it('onPress指定時にタップ可能', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Card onPress={onPress} testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    expect(card.props.accessibilityRole).toBe('button');
  });

  it('onPress指定時にタップでコールバックが呼ばれる', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Card onPress={onPress} testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    fireEvent.press(getByTestId('card'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled=true時にonPressが呼ばれない', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Card onPress={onPress} disabled={true} testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    fireEvent.press(getByTestId('card'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('disabled=true時にopacity 0.5で半透明になる', () => {
    const { getByTestId } = render(
      <Card onPress={() => {}} disabled={true} testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    const style = StyleSheet.flatten(card.props.style);

    expect(style.opacity).toBe(0.5);
    expect(card.props.accessibilityState?.disabled).toBe(true);
  });

  it('onPress未指定時にタップ不可', () => {
    const { getByTestId } = render(
      <Card testID="card">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('card');
    expect(card.props.accessibilityRole).toBe('none');
  });

  it('testIDが正しく設定される', () => {
    const { getByTestId } = render(
      <Card testID="custom-card-id">
        <Text>コンテンツ</Text>
      </Card>
    );

    const card = getByTestId('custom-card-id');
    expect(card).toBeTruthy();
  });

  it('accessibilityRoleが適切に設定される', () => {
    // onPressあり → button
    const { getByTestId: getByTestIdWithPress } = render(
      <Card onPress={() => {}} testID="card-with-press">
        <Text>コンテンツ</Text>
      </Card>
    );
    const cardWithPress = getByTestIdWithPress('card-with-press');
    expect(cardWithPress.props.accessibilityRole).toBe('button');

    // onPressなし → none
    const { getByTestId: getByTestIdWithoutPress } = render(
      <Card testID="card-without-press">
        <Text>コンテンツ</Text>
      </Card>
    );
    const cardWithoutPress = getByTestIdWithoutPress('card-without-press');
    expect(cardWithoutPress.props.accessibilityRole).toBe('none');
  });

  // エッジケース・異常系テスト
  describe('エッジケース', () => {
    it('onPress指定時かつdisabled=trueの場合、onPressが呼ばれない', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card onPress={onPress} disabled={true} testID="card">
          <Text>コンテンツ</Text>
        </Card>
      );

      fireEvent.press(getByTestId('card'));

      expect(onPress).not.toHaveBeenCalled();
      expect(getByTestId('card').props.accessibilityState?.disabled).toBe(true);
    });

    it('variant未指定時はdefaultが適用される', () => {
      const { getByTestId } = render(
        <Card testID="card">
          <Text>コンテンツ</Text>
        </Card>
      );

      const card = getByTestId('card');
      const style = StyleSheet.flatten(card.props.style);

      // defaultスタイル（枠線）が適用される
      expect(style.borderWidth).toBe(1);
      expect(style.borderColor).toBe('#CCCCCC');
    });

    it('childrenが空でもレンダリングできる', () => {
      const { getByTestId } = render(
        <Card testID="card">
          <></>
        </Card>
      );

      expect(getByTestId('card')).toBeTruthy();
    });

    it('children が複数の要素を含むことができる', () => {
      const { getByText } = render(
        <Card testID="card">
          <Text>タイトル</Text>
          <Text>本文</Text>
          <Text>フッター</Text>
        </Card>
      );

      expect(getByText('タイトル')).toBeTruthy();
      expect(getByText('本文')).toBeTruthy();
      expect(getByText('フッター')).toBeTruthy();
    });

    it('testIDなしでもレンダリングできる', () => {
      const { getByText } = render(
        <Card>
          <Text>コンテンツ</Text>
        </Card>
      );

      expect(getByText('コンテンツ')).toBeTruthy();
    });

    it('カスタムaccessibilityLabelが適用される', () => {
      const { getByTestId } = render(
        <Card testID="card" accessibilityLabel="日記カード">
          <Text>コンテンツ</Text>
        </Card>
      );

      const card = getByTestId('card');
      expect(card.props.accessibilityLabel).toBe('日記カード');
    });

    it('onPressを複数回連続で呼んでも正常に動作する', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card onPress={onPress} testID="card">
          <Text>コンテンツ</Text>
        </Card>
      );

      const card = getByTestId('card');
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('variant="elevated"とonPressの組み合わせが正常に動作する', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card variant="elevated" onPress={onPress} testID="card">
          <Text>コンテンツ</Text>
        </Card>
      );

      const card = getByTestId('card');

      // タップ可能
      fireEvent.press(card);
      expect(onPress).toHaveBeenCalledTimes(1);

      // elevatedスタイルも適用されている
      const style = StyleSheet.flatten(card.props.style);
      if (Platform.OS === 'ios') {
        expect(style.shadowColor).toBe('#000000');
      }
    });
  });
});
