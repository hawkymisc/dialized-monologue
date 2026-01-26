# UIコンポーネント仕様

実装済みの再利用可能なUIコンポーネントの一覧と使用方法。

## コンポーネント一覧

### 1. Button

**パス**: `src/components/Button.tsx`

汎用的なボタンコンポーネント。variant指定でスタイルを切り替え可能。

#### Props

```typescript
interface ButtonProps {
  title: string;                 // ボタンテキスト
  onPress: () => void;           // タップ時のコールバック
  variant?: 'primary' | 'secondary' | 'outline'; // デフォルト: 'primary'
  disabled?: boolean;            // 無効化状態
  loading?: boolean;             // ローディング状態
  testID?: string;               // テスト用ID
  accessibilityLabel?: string;   // アクセシビリティラベル
}
```

#### 使用例

```tsx
import { Button } from '@/components/Button';

<Button
  title="保存"
  onPress={() => console.log('保存')}
  variant="primary"
/>

<Button
  title="キャンセル"
  onPress={() => console.log('キャンセル')}
  variant="outline"
/>
```

#### スタイル仕様

- **サイズ**: 48×48（最小タップ領域）
- **ボーダー**: 8px radius
- **variant別の色**:
  - primary: #007AFF（iOS Blue）
  - secondary: #5AC8FA
  - outline: 透明背景、#007AFFボーダー
- **disabled時**: opacity 0.5

---

### 2. TextInput

**パス**: `src/components/TextInput.tsx`

テキスト入力コンポーネント。label、error表示、multiline対応。

#### Props

```typescript
interface TextInputProps {
  value: string;                 // 入力値
  onChangeText: (text: string) => void; // 入力変更時のコールバック
  placeholder?: string;          // プレースホルダー
  multiline?: boolean;           // 複数行入力（デフォルト: false）
  label?: string;                // ラベル
  error?: string;                // エラーメッセージ
  editable?: boolean;            // 編集可能状態（デフォルト: true）
  testID?: string;               // テスト用ID
  accessibilityLabel?: string;   // アクセシビリティラベル
}
```

#### 使用例

```tsx
import { TextInput } from '@/components/TextInput';

<TextInput
  label="タイトル"
  value={title}
  onChangeText={setTitle}
  placeholder="タイトルを入力"
/>

<TextInput
  label="本文"
  value={content}
  onChangeText={setContent}
  multiline
  error={error}
/>
```

#### スタイル仕様

- **ボーダー**: 1px、#ccc（通常）/ #FF3B30（エラー時）
- **ボーダー半径**: 8px
- **パディング**: 12px（水平）、10px（垂直）
- **最小高さ**: 44px
- **フォントサイズ**: 16px（入力）、14px（ラベル）、12px（エラー）

---

### 3. ListItem

**パス**: `src/components/ListItem.tsx`

タップ可能な一覧アイテム。title、subtitle、右矢印表示に対応。

#### Props

```typescript
interface ListItemProps {
  title: string;                // メインテキスト（必須）
  subtitle?: string;            // サブテキスト
  onPress: () => void;          // タップ時のコールバック（必須）
  disabled?: boolean;           // 無効化状態
  showArrow?: boolean;          // 右矢印表示（デフォルト: true）
  testID?: string;              // テスト用ID
  accessibilityLabel?: string;  // アクセシビリティラベル
}
```

#### 使用例

```tsx
import { ListItem } from '@/components/ListItem';

<ListItem
  title="今日の日記"
  subtitle="2026-01-26"
  onPress={() => navigate('DiaryDetail')}
/>

<ListItem
  title="設定"
  onPress={() => navigate('Settings')}
  showArrow
/>
```

#### スタイル仕様

- **最小高さ**: 56px
- **パディング**: 16px（水平）、12px（垂直）
- **背景色**: #FFFFFF（通常）/ #F0F0F0（押下時）
- **ボーダー**: 1px下線、#E0E0E0
- **タイトル**: 16px、太字600
- **サブタイトル**: 14px、#666666
- **矢印**: 20px、›、#999999

---

### 4. VoiceInputButton

**パス**: `src/components/VoiceInputButton.tsx`

音声入力トリガーボタン。録音中はパルスアニメーション表示。

#### Props

```typescript
interface VoiceInputButtonProps {
  onPress: () => void;           // タップ時のコールバック
  recording?: boolean;           // 録音中の状態（デフォルト: false）
  disabled?: boolean;            // 無効化状態
  testID?: string;               // テスト用ID
  accessibilityLabel?: string;   // アクセシビリティラベル
}
```

#### 使用例

```tsx
import { VoiceInputButton } from '@/components/VoiceInputButton';

<VoiceInputButton
  onPress={toggleRecording}
  recording={isRecording}
/>
```

#### スタイル仕様

- **サイズ**: 56×56（円形）
- **背景色**: #007AFF（通常）/ #FF3B30（録音中）
- **アイコン**: 🎤、24px
- **アニメーション**: 録音中は1.0→1.2→1.0のscale変化（600ms×2）
- **disabled時**: opacity 0.5

---

### 5. Card

**パス**: `src/components/Card.tsx`

コンテンツ表示用コンテナ。タップ可能/不可を選択可能。

#### Props

```typescript
interface CardProps {
  children: React.ReactNode;       // カード内のコンテンツ
  variant?: 'default' | 'elevated'; // デフォルト: 'default'
  onPress?: () => void;            // タップ可能にする場合のコールバック
  disabled?: boolean;              // タップ無効化（onPress指定時のみ有効）
  testID?: string;                 // テスト用ID
  accessibilityLabel?: string;     // アクセシビリティラベル
}
```

#### 使用例

```tsx
import { Card } from '@/components/Card';

<Card variant="default">
  <Text>カード内のコンテンツ</Text>
</Card>

<Card
  variant="elevated"
  onPress={() => console.log('タップされた')}
>
  <Text>タップ可能なカード</Text>
</Card>
```

#### スタイル仕様

- **ボーダー半径**: 8px
- **パディング**: 16px
- **背景色**: #FFFFFF
- **variant別**:
  - default: 1pxボーダー、#CCCCCC
  - elevated: iOS（shadow）/Android（elevation: 4）
- **pressed時**: 背景色 #F0F0F0
- **disabled時**: opacity 0.5

---

## アクセシビリティ対応

すべてのコンポーネントは以下のアクセシビリティ機能に対応しています：

- `accessibilityRole`: 適切なロール（button、text等）
- `accessibilityLabel`: カスタムラベル指定可能
- `accessibilityState`: disabled、busy等の状態反映
- `accessibilityHint`: 追加の説明（必要に応じて）

## テストカバレッジ

全コンポーネントのテストカバレッジ:

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
components/            |     100 |    87.32 |     100 |     100 |
  Button.tsx           |     100 |    86.66 |     100 |     100 |
  Card.tsx             |     100 |       80 |     100 |     100 |
  ListItem.tsx         |     100 |    78.57 |     100 |     100 |
  TextInput.tsx        |     100 |      100 |     100 |     100 |
  VoiceInputButton.tsx |     100 |    93.33 |     100 |     100 |
-----------------------|---------|----------|---------|---------|
```

## カラーパレット

プロジェクト全体で使用する共通カラー:

```typescript
const COLORS = {
  // Primary
  primary: '#007AFF',      // iOS Blue
  secondary: '#5AC8FA',    // iOS Teal

  // Status
  error: '#FF3B30',        // Red
  success: '#34C759',      // Green
  warning: '#FF9500',      // Orange

  // Neutral
  text: '#000000',
  textSecondary: '#666666',
  border: '#CCCCCC',
  background: '#FFFFFF',
  pressed: '#F0F0F0',
  placeholder: '#999999',

  // Opacity
  disabled: 0.5,
};
```

## デザイン原則

1. **最小タップ領域**: 44×44以上（Apple HIG準拠）
2. **ボーダー半径**: 8px（統一）
3. **パディング**: 16px（標準）、12px（小）
4. **フォントサイズ**: 16px（本文）、14px（ラベル）、12px（キャプション）
5. **フォントウェイト**: 600（太字）、400（通常）
6. **disabled状態**: opacity 0.5
7. **アニメーション**: 300ms以内（画面遷移）、600ms（パルス等）

---

**最終更新**: 2026-01-26
