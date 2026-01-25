/**
 * Cardコンポーネント
 * 日記エントリー表示用コンテナ
 */
import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';

// カラー定数
const COLORS = {
  background: '#FFFFFF',
  border: '#CCCCCC',
  pressed: '#F0F0F0',
  shadow: '#000000',
};

export interface CardProps {
  children: React.ReactNode;       // カード内のコンテンツ
  variant?: 'default' | 'elevated'; // デフォルト: 'default'
  onPress?: () => void;            // タップ可能にする場合のコールバック
  disabled?: boolean;              // タップ無効化（onPress指定時のみ有効）
  testID?: string;                 // テスト用ID
  accessibilityLabel?: string;     // アクセシビリティラベル
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  disabled = false,
  testID,
  accessibilityLabel,
}) => {
  const isDisabled = disabled;

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const cardStyle: ViewStyle[] = [
    styles.card,
    variant === 'elevated' ? styles.card_elevated : styles.card_default,
    isDisabled && styles.card_disabled,
  ].filter(Boolean) as ViewStyle[];

  // タップ可能な場合はPressableでラップ
  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled }}
        testID={testID}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && !isDisabled && styles.card_pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  // タップ不可の場合はViewでラップ
  return (
    <View
      style={cardStyle}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </View>
  );
};

// クロスプラットフォーム対応のshadow/elevation
const ELEVATION_STYLES = Platform.select({
  ios: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

const BORDER_RADIUS = 8;
const PADDING = 16;
const BORDER_WIDTH = 1;
const DISABLED_OPACITY = 0.5;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS,
    padding: PADDING,
  },
  card_default: {
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.border,
  },
  card_elevated: {
    ...ELEVATION_STYLES,
  },
  card_pressed: {
    backgroundColor: COLORS.pressed,
  },
  card_disabled: {
    opacity: DISABLED_OPACITY,
  },
});
