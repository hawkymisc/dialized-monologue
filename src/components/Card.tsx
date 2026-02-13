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
import { useThemeColors, ThemeColors } from '../theme';

export interface CardProps {
  children: React.ReactNode;       // カード内のコンテンツ
  variant?: 'default' | 'elevated'; // デフォルト: 'default'
  onPress?: () => void;            // タップ可能にする場合のコールバック
  disabled?: boolean;              // タップ無効化（onPress指定時のみ有効）
  style?: ViewStyle;               // 追加スタイル
  testID?: string;                 // テスト用ID
  accessibilityLabel?: string;     // アクセシビリティラベル
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}) => {
  const theme = useThemeColors();
  const styles = createStyles(theme);
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
    style,
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

const BORDER_RADIUS = 8;
const PADDING = 16;
const BORDER_WIDTH = 1;
const DISABLED_OPACITY = 0.5;

// クロスプラットフォーム対応のshadow/elevation
const createElevationStyles = (theme: ThemeColors) => Platform.select({
  ios: {
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

const createStyles = (theme: ThemeColors) => {
  const elevationStyles = createElevationStyles(theme);
  return StyleSheet.create({
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: BORDER_RADIUS,
      padding: PADDING,
    } as ViewStyle,
    card_default: {
      borderWidth: BORDER_WIDTH,
      borderColor: theme.border,
    } as ViewStyle,
    card_elevated: {
      ...elevationStyles,
    } as ViewStyle,
    card_pressed: {
      backgroundColor: theme.selected,
    } as ViewStyle,
    card_disabled: {
      opacity: DISABLED_OPACITY,
    } as ViewStyle,
  });
};
