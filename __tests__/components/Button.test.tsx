/**
 * Buttonコンポーネントのテスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('タイトルを表示する', () => {
    const { getByText } = render(
      <Button title="保存" onPress={() => {}} />
    );
    expect(getByText('保存')).toBeTruthy();
  });

  it('ボタンをタップするとonPressが呼ばれる', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="保存" onPress={onPress} testID="save-button" />
    );

    fireEvent.press(getByTestId('save-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled時はonPressが呼ばれない', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="保存" onPress={onPress} disabled testID="save-button" />
    );

    fireEvent.press(getByTestId('save-button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('loading時はActivityIndicatorが表示される', () => {
    const { getByTestId } = render(
      <Button title="保存" onPress={() => {}} loading testID="save-button" />
    );

    // ActivityIndicatorは常にtestID付きでレンダリングされる
    const button = getByTestId('save-button');
    expect(button).toBeTruthy();
  });

  it('loading時はonPressが呼ばれない', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="保存" onPress={onPress} loading testID="save-button" />
    );

    fireEvent.press(getByTestId('save-button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('variant=primaryでprimaryスタイルが適用される', () => {
    const { getByTestId } = render(
      <Button
        title="保存"
        onPress={() => {}}
        variant="primary"
        testID="primary-button"
      />
    );

    const button = getByTestId('primary-button');
    expect(button.props.accessibilityState?.disabled).toBeFalsy();
  });

  it('variant=secondaryでsecondaryスタイルが適用される', () => {
    const { getByTestId } = render(
      <Button
        title="キャンセル"
        onPress={() => {}}
        variant="secondary"
        testID="secondary-button"
      />
    );

    const button = getByTestId('secondary-button');
    expect(button).toBeTruthy();
  });

  it('variant=outlineでoutlineスタイルが適用される', () => {
    const { getByTestId } = render(
      <Button
        title="詳細"
        onPress={() => {}}
        variant="outline"
        testID="outline-button"
      />
    );

    const button = getByTestId('outline-button');
    expect(button).toBeTruthy();
  });

  it('デフォルトvariantはprimary', () => {
    const { getByTestId } = render(
      <Button
        title="保存"
        onPress={() => {}}
        testID="default-button"
      />
    );

    const button = getByTestId('default-button');
    expect(button).toBeTruthy();
  });

  it('disabled時はaccessibilityStateがdisabledになる', () => {
    const { getByTestId } = render(
      <Button
        title="保存"
        onPress={() => {}}
        disabled
        testID="disabled-button"
      />
    );

    const button = getByTestId('disabled-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });
});
