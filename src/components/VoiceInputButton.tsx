/**
 * VoiceInputButtonコンポーネント
 * 音声入力のトリガーボタン
 */
import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';

// カラー定数
const COLORS = {
  primary: '#007AFF',      // iOS Blue
  recording: '#FF3B30',    // Red
};

export interface VoiceInputButtonProps {
  onPress: () => void;           // タップ時のコールバック
  recording?: boolean;           // 録音中の状態（デフォルト: false）
  disabled?: boolean;            // 無効化状態
  testID?: string;               // テスト用ID
  accessibilityLabel?: string;   // アクセシビリティラベル
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onPress,
  recording = false,
  disabled = false,
  testID,
  accessibilityLabel = '音声入力',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (recording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
      pulseAnim.setValue(1);
    };
  }, [recording, pulseAnim]);

  const isDisabled = disabled;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  const buttonStyle = [
    styles.button,
    recording && styles.button_recording,
    isDisabled && styles.button_disabled,
  ].filter(Boolean) as ViewStyle[];

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled: isDisabled,
        busy: recording,
      }}
      testID={testID}
    >
      <Animated.View
        style={[buttonStyle, animatedStyle]}
        testID={testID ? `${testID}-animated-view` : undefined}
      >
        <Text style={styles.icon}>🎤</Text>
      </Animated.View>
    </Pressable>
  );
};

const BUTTON_SIZE = 56;
const ICON_SIZE = 24;
const DISABLED_OPACITY = 0.5;

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_recording: {
    backgroundColor: COLORS.recording,
  },
  button_disabled: {
    opacity: DISABLED_OPACITY,
  },
  icon: {
    fontSize: ICON_SIZE,
  },
});
