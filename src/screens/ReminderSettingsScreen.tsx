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

const COLORS = {
  background: '#F5F5F5',
  white: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  error: '#FF3B30',
  primary: '#007AFF',
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.container,
  } as ViewStyle,
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.titleBottom,
  } as TextStyle,
  emptyText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  } as TextStyle,
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.container,
    borderRadius: 8,
    marginBottom: SPACING.itemGap,
  } as ViewStyle,
  timeText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
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
    color: COLORS.error,
  } as TextStyle,
  addButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.container,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.container,
  } as ViewStyle,
  addButtonText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.white,
  } as TextStyle,
});
