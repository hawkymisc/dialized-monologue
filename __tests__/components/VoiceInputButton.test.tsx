/**
 * VoiceInputButtonコンポーネントのテスト
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { VoiceInputButton } from '../../src/components/VoiceInputButton';

describe('VoiceInputButton', () => {
  it('マイクアイコン（🎤）を表示する', () => {
    const { getByText } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    const icon = getByText('🎤');
    expect(icon).toBeTruthy();
  });

  it('アイコンのフォントサイズは24である', () => {
    const { getByText } = render(
      <VoiceInputButton onPress={() => {}} />
    );

    const icon = getByText('🎤');
    const style = StyleSheet.flatten(icon.props.style);

    expect(style.fontSize).toBe(24);
  });

  it('ボタンのサイズは56×56である', () => {
    const { getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    const animatedView = getByTestId('voice-button-animated-view');
    const style = StyleSheet.flatten(animatedView.props.style);

    expect(style.width).toBe(56);
    expect(style.height).toBe(56);
    expect(style.borderRadius).toBe(28); // 円形 (56/2)
  });

  it('通常状態では背景色が#007AFFである', () => {
    const { getByTestId } = render(
      <VoiceInputButton onPress={() => {}} testID="voice-button" />
    );

    const animatedView = getByTestId('voice-button-animated-view');
    const style = StyleSheet.flatten(animatedView.props.style);

    expect(style.backgroundColor).toBe('#007AFF');
  });

  it('タップ時にonPressが呼ばれる', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <VoiceInputButton onPress={onPress} testID="voice-button" />
    );

    fireEvent.press(getByTestId('voice-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('recording=true時に背景色が#FF3B30（赤）になる', () => {
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={() => {}}
        recording={true}
        testID="voice-button"
      />
    );

    const animatedView = getByTestId('voice-button-animated-view');
    const style = StyleSheet.flatten(animatedView.props.style);

    expect(style.backgroundColor).toBe('#FF3B30');

    // アクセシビリティでも録音中状態を確認
    const button = getByTestId('voice-button');
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

  it('disabled=true時にopacity 0.5で半透明になる', () => {
    const { getByTestId } = render(
      <VoiceInputButton
        onPress={() => {}}
        disabled={true}
        testID="voice-button"
      />
    );

    const animatedView = getByTestId('voice-button-animated-view');
    const style = StyleSheet.flatten(animatedView.props.style);

    expect(style.opacity).toBe(0.5);

    // アクセシビリティでもdisabled状態を確認
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

  // エッジケース・異常系テスト
  describe('エッジケース', () => {
    it('recording=true かつ disabled=true の場合、disabledが優先される', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <VoiceInputButton
          onPress={onPress}
          recording={true}
          disabled={true}
          testID="voice-button"
        />
      );

      fireEvent.press(getByTestId('voice-button'));

      expect(onPress).not.toHaveBeenCalled();
      expect(getByTestId('voice-button').props.accessibilityState?.disabled).toBe(true);
    });

    it('recording=true かつ disabled=true の場合、背景色は録音中（赤）だがopacityが0.5になる', () => {
      const { getByTestId } = render(
        <VoiceInputButton
          onPress={() => {}}
          recording={true}
          disabled={true}
          testID="voice-button"
        />
      );

      const animatedView = getByTestId('voice-button-animated-view');
      const style = StyleSheet.flatten(animatedView.props.style);

      // 録音中の赤色
      expect(style.backgroundColor).toBe('#FF3B30');
      // disabledの半透明
      expect(style.opacity).toBe(0.5);
    });

    it('testIDなしでもレンダリングできる', () => {
      const { getByText } = render(
        <VoiceInputButton onPress={() => {}} />
      );

      expect(getByText('🎤')).toBeTruthy();
    });

    it('カスタムaccessibilityLabelが適用される', () => {
      const { getByTestId } = render(
        <VoiceInputButton
          onPress={() => {}}
          accessibilityLabel="録音開始ボタン"
          testID="voice-button"
        />
      );

      const button = getByTestId('voice-button');
      expect(button.props.accessibilityLabel).toBe('録音開始ボタン');
    });

    it('デフォルトのaccessibilityLabelは"音声入力"', () => {
      const { getByTestId } = render(
        <VoiceInputButton onPress={() => {}} testID="voice-button" />
      );

      const button = getByTestId('voice-button');
      expect(button.props.accessibilityLabel).toBe('音声入力');
    });

    it('onPressを複数回連続で呼んでも正常に動作する', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <VoiceInputButton onPress={onPress} testID="voice-button" />
      );

      const button = getByTestId('voice-button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('recording状態の切り替えが正しく動作する', () => {
      const { rerender, getByTestId } = render(
        <VoiceInputButton onPress={() => {}} recording={false} testID="voice-button" />
      );

      let animatedView = getByTestId('voice-button-animated-view');
      let style = StyleSheet.flatten(animatedView.props.style);
      expect(style.backgroundColor).toBe('#007AFF'); // 通常状態

      // 録音開始
      rerender(
        <VoiceInputButton onPress={() => {}} recording={true} testID="voice-button" />
      );
      animatedView = getByTestId('voice-button-animated-view');
      style = StyleSheet.flatten(animatedView.props.style);
      expect(style.backgroundColor).toBe('#FF3B30'); // 録音中

      // 録音停止
      rerender(
        <VoiceInputButton onPress={() => {}} recording={false} testID="voice-button" />
      );
      animatedView = getByTestId('voice-button-animated-view');
      style = StyleSheet.flatten(animatedView.props.style);
      expect(style.backgroundColor).toBe('#007AFF'); // 通常状態に戻る
    });
  });
});
