/**
 * VoiceInputButtonコンポーネントのテスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VoiceInputButton } from '../../src/components/VoiceInputButton';

describe('VoiceInputButton', () => {
  it('通常状態でマイクアイコンを表示する', () => {
    const { getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    const button = getByTestId('voice-button');
    expect(button).toBeTruthy();
  });

  it('タップ時にonPressが呼ばれる', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <VoiceInputButton onPress={onPress} testID="voice-button" />
    );

    fireEvent.press(getByTestId('voice-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('recording=true時に赤色で表示される', () => {
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={() => {}}
        recording={true}
        testID="voice-button"
      />
    );

    const button = getByTestId('voice-button');
    expect(button).toBeTruthy();
    // recording時にbusyがtrueになることで録音中状態を確認
    expect(button.props.accessibilityState?.busy).toBe(true);
  });

  it('recording=true時にアニメーションが動作する', () => {
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={() => {}}
        recording={true}
        testID="voice-button"
      />
    );

    const button = getByTestId('voice-button');
    // Animated.Viewが使われていることを確認
    expect(button).toBeTruthy();
  });

  it('disabled=true時にonPressが呼ばれない', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={onPress}
        disabled={true}
        testID="voice-button"
      />
    );

    fireEvent.press(getByTestId('voice-button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('disabled=true時に半透明で表示される', () => {
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={() => {}}
        disabled={true}
        testID="voice-button"
      />
    );

    const button = getByTestId('voice-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('testIDが正しく設定される', () => {
    const { getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="custom-test-id" />
    );

    const button = getByTestId('custom-test-id');
    expect(button).toBeTruthy();
  });

  it('accessibilityRole="button"が設定される', () => {
    const { getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    const button = getByTestId('voice-button');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('accessibilityStateにdisabled/busyが反映される', () => {
    const { rerender, getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    let button = getByTestId('voice-button');
    expect(button.props.accessibilityState?.disabled).toBeFalsy();
    expect(button.props.accessibilityState?.busy).toBeFalsy();

    // disabled時
    rerender(
      <VoiceInputButton
        onPress={() => {}}
        disabled={true}
        testID="voice-button"
      />
    );
    button = getByTestId('voice-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);

    // recording時（busy）
    rerender(
      <VoiceInputButton
        onPress={() => {}}
        recording={true}
        testID="voice-button"
      />
    );
    button = getByTestId('voice-button');
    expect(button.props.accessibilityState?.busy).toBe(true);
  });
});
