/**
 * ListItemコンポーネント
 * 一覧表示用タップ可能アイテム
 */
import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors, ThemeColors } from '../theme';

export interface ListItemProps {
  title: string;                // メインテキスト（必須）
  subtitle?: string;            // サブテキスト（オプション）
  onPress: () => void;          // タップ時のコールバック（必須）
  disabled?: boolean;           // 無効化状態
  showArrow?: boolean;          // 右矢印表示（デフォルト: true）
  testID?: string;              // テスト用ID
  accessibilityLabel?: string;  // アクセシビリティラベル
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  disabled = false,
  showArrow = true,
  testID,
  accessibilityLabel = title,
}) => {
  const theme = useThemeColors();
  const styles = createStyles(theme);
  const isDisabled = disabled;

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  const containerStyle = [
    styles.container,
    isDisabled && styles.container_disabled,
  ].filter(Boolean) as ViewStyle[];

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={subtitle}
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      style={({ pressed }) => [
        ...containerStyle,
        pressed && !isDisabled && styles.container_pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {showArrow && <Text style={styles.arrow}>›</Text>}
      </View>
    </Pressable>
  );
};

// サイズ定数
const MIN_HEIGHT = 56;
const PADDING_HORIZONTAL = 16;
const PADDING_VERTICAL = 12;
const TITLE_FONT_SIZE = 16;
const SUBTITLE_FONT_SIZE = 14;
const ARROW_FONT_SIZE = 20;
const DISABLED_OPACITY = 0.5;

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    minHeight: MIN_HEIGHT,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    backgroundColor: theme.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  } as ViewStyle,
  container_disabled: {
    opacity: DISABLED_OPACITY,
  } as ViewStyle,
  container_pressed: {
    backgroundColor: theme.selected,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  textContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  } as TextStyle,
  subtitle: {
    fontSize: SUBTITLE_FONT_SIZE,
    color: theme.textSecondary,
  } as TextStyle,
  arrow: {
    fontSize: ARROW_FONT_SIZE,
    color: theme.textSecondary,
    marginLeft: 8,
  } as TextStyle,
});
