/**
 * AppNavigator
 * アプリケーションのメインナビゲーション構成
 *
 * Stack Navigator:
 * - Home（ルート）
 * - DiaryInput（新規日記作成）
 * - DiaryDetail（日記詳細）
 * - Settings（設定）
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { DiaryInputScreen } from '../screens/DiaryInputScreen';
import { DiaryDetailScreen } from '../screens/DiaryDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ReminderSettingsScreen } from '../screens/ReminderSettingsScreen';
import { QuestionSettingsScreen } from '../screens/QuestionSettingsScreen';
import { DataManagementScreen } from '../screens/DataManagementScreen';
import { DisplaySettingsScreen } from '../screens/DisplaySettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '日記' }}
        />
        <Stack.Screen
          name="DiaryInput"
          component={DiaryInputScreen}
          options={{ title: '日記を書く' }}
        />
        <Stack.Screen
          name="DiaryDetail"
          component={DiaryDetailScreen}
          options={{ title: '日記詳細' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: '設定' }}
        />
        <Stack.Screen
          name="ReminderSettings"
          component={ReminderSettingsScreen}
          options={{ title: 'リマインダー設定' }}
        />
        <Stack.Screen
          name="QuestionSettings"
          component={QuestionSettingsScreen}
          options={{ title: '質問設定' }}
        />
        <Stack.Screen
          name="DataManagement"
          component={DataManagementScreen}
          options={{ title: 'データ管理' }}
        />
        <Stack.Screen
          name="DisplaySettings"
          component={DisplaySettingsScreen}
          options={{ title: '表示設定' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
