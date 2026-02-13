/**
 * Buttonコンポーネント
 */
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { useThemeColors, ThemeColors } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  testID,
}) => {
  const theme = useThemeColors();
  const styles = createStyles(theme);
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  const buttonStyle = [
    styles.button,
    styles[`button_${variant}` as keyof typeof styles] as ViewStyle,
    isDisabled && styles.button_disabled,
  ].filter(Boolean) as ViewStyle[];

  const textStyle = [
    styles.text,
    styles[`text_${variant}` as keyof typeof styles] as TextStyle,
    isDisabled && styles.text_disabled,
  ].filter(Boolean) as TextStyle[];

  // ActivityIndicatorの色: outline → primary, それ以外 → white
  const indicatorColor = variant === 'outline' ? theme.primary : theme.white;

  return (
    <Pressable
      style={buttonStyle}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  } as ViewStyle,
  button_primary: {
    backgroundColor: theme.primary,
  } as ViewStyle,
  button_secondary: {
    backgroundColor: '#8E8E93', // gray - テーマに依存しない固定色
  } as ViewStyle,
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  } as ViewStyle,
  button_disabled: {
    opacity: 0.5,
  } as ViewStyle,
  text: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  text_primary: {
    color: theme.white,
  } as TextStyle,
  text_secondary: {
    color: theme.white,
  } as TextStyle,
  text_outline: {
    color: theme.primary,
  } as TextStyle,
  text_disabled: {
    opacity: 1, // 親のopacityで制御されるため
  } as TextStyle,
});
