/**
 * TextInputコンポーネント
 */
import React from 'react';
import {
  TextInput as RNTextInput,
  Text,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useThemeColors, ThemeColors } from '../theme';

const FONT_SIZES = {
  label: 14,
  input: 16,
  error: 12,
} as const;

export interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  label?: string;
  error?: string;
  editable?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  label,
  error,
  editable = true,
  testID,
  accessibilityLabel,
}) => {
  const theme = useThemeColors();
  const styles = createStyles(theme);

  const inputStyle: TextStyle[] = [
    styles.input,
    error && styles.inputError,
  ].filter(Boolean) as TextStyle[];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      <RNTextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        editable={editable}
        testID={testID || 'text-input'}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled: !editable }}
        accessibilityHint={error}
        importantForAccessibility="yes"
      />
      {error && (
        <Text
          style={styles.error}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    marginBottom: 16,
  } as ViewStyle,
  label: {
    fontSize: FONT_SIZES.label,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.text,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FONT_SIZES.input,
    color: theme.text,
    minHeight: 44,
  } as TextStyle,
  inputError: {
    borderColor: theme.error,
  } as ViewStyle,
  error: {
    fontSize: FONT_SIZES.error,
    color: theme.error,
    marginTop: 4,
  } as TextStyle,
});
