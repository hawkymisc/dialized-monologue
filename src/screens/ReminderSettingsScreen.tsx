/**
 * ReminderSettingsScreen
 * リマインダー設定画面 - 通知時刻の追加・削除・ON/OFF
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';
import { ReminderTime } from '../types';
import { useThemeColors, ThemeColors } from '../theme';

const FONT_SIZES = { title: 24, body: 16, caption: 14 };
const SPACING = { container: 16, titleBottom: 24, itemGap: 12 };

const DEFAULT_REMINDER: ReminderTime = {
  hour: 21,
  minute: 0,
  isEnabled: true,
};

const formatTime = (hour: number, minute: number): string => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const ReminderSettingsScreen: React.FC = () => {
  const theme = useThemeColors();
  const styles = createStyles(theme);
  const {
    settings,
    loadSettings,
    addReminderTime,
    removeReminderTime,
    toggleReminderTime,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const { reminderTimes } = settings;

  const handleAdd = () => {
    addReminderTime({ ...DEFAULT_REMINDER });
  };

  const renderItem = ({ item, index }: { item: ReminderTime; index: number }) => {
    const timeStr = formatTime(item.hour, item.minute);
    return (
      <View style={styles.itemContainer} testID={`reminder-item-${index}`}>
        <Text style={styles.timeText}>{timeStr}</Text>
        <View style={styles.itemActions}>
          <Switch
            testID={`toggle-reminder-${index}`}
            value={item.isEnabled}
            onValueChange={() => toggleReminderTime(index)}
            accessibilityLabel={`${timeStr}のリマインダーを切り替え`}
          />
          <TouchableOpacity
            testID={`delete-reminder-${index}`}
            onPress={() => removeReminderTime(index)}
            accessibilityRole="button"
            accessibilityLabel={`${timeStr}のリマインダーを削除`}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>削除</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container} testID="reminder-settings-screen">
      <Text style={styles.title} accessibilityRole="header">
        リマインダー設定
      </Text>

      {reminderTimes.length === 0 ? (
        <Text style={styles.emptyText}>リマインダーがありません</Text>
      ) : (
        <FlatList
          data={reminderTimes}
          renderItem={renderItem}
          keyExtractor={(_, index) => String(index)}
        />
      )}

      <TouchableOpacity
        testID="add-reminder-button"
        style={styles.addButton}
        onPress={handleAdd}
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>リマインダーを追加</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: theme.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
  emptyText: {
    fontSize: FONT_SIZES.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.cardBackground,
    padding: SPACING.container,
    borderRadius: 8,
    marginBottom: SPACING.itemGap,
  } as ViewStyle,
  timeText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: theme.text,
  } as TextStyle,
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as ViewStyle,
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  } as ViewStyle,
  deleteText: {
    fontSize: FONT_SIZES.caption,
    color: theme.error,
  } as TextStyle,
  addButton: {
    backgroundColor: theme.primary,
    padding: SPACING.container,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.container,
  } as ViewStyle,
  addButtonText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: theme.cardBackground,
  } as TextStyle,
});
