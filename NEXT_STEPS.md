# 次のステップ: dialized-monologue

最終更新: 2026-01-21

## 📊 現在の状態

### ✅ 完了済み
- **Phase 1-3**: 要件定義、プロジェクトセットアップ完了
- **Phase 4 Step 1-3**: 基盤層、ドメインロジック、サービス層完了
- **テスト**: 133テストケース全てパス、カバレッジ93.05%
- **PR #7**: エクスポートサービス・日付ユーティリティ・Buttonコンポーネント実装
  - CodeRabbitレビュー対応済み
  - マージ待ち

### 🔄 進行中
- **Phase 4 Step 4**: UI層の実装

### ⚠️ 既知の課題
- **React Nativeテスト環境**: Expo SDK 54のWinter runtimeとjest-expoの互換性問題
  - UIコンポーネントのテストが実行できない
  - 次セッションで優先的に対応が必要

---

## 🎯 次回セッションの優先タスク

### Task 1: React Nativeテスト環境の修正 🔴 高優先度

#### 問題の詳細
```
jest-expo と Expo SDK 54 Winter runtime の互換性問題により、
@testing-library/react-native を使用するテストが実行できない。

エラー:
ReferenceError: You are trying to `import` a file outside of the scope of the test code.
```

#### 調査・対応方針

1. **Option A: jest-expo設定の調整**
   - jest-expoの最新版を確認
   - transformIgnorePatterns の見直し
   - setupFilesの追加設定

2. **Option B: カスタムテスト環境の構築**
   - jest-expoを使わず、ts-jestベースで構築
   - React Native modulesの変換設定を手動で追加
   - @testing-library/react-nativeの動作確認

3. **Option C: Expo SDK 53へのダウングレード（非推奨）**
   - 最終手段として検討

#### 成果物
- [ ] UIコンポーネントのテストが実行可能になる
- [ ] Button.test.tsx が正常に実行される
- [ ] 設定方法をREADMEまたはドキュメントに記載

---

### Task 2: TextInputコンポーネントの実装

#### 仕様（計画ドキュメントより）

```typescript
interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  label?: string;
  error?: string;
  testID?: string;
}
```

#### テストケース（詳細は計画参照）
- プレースホルダー表示
- 入力値の制御
- テキスト変更イベント
- ラベル表示
- エラーメッセージ表示
- multiline対応

#### 実装順序（TDD）
1. RED: テスト作成 (`__tests__/components/TextInput.test.tsx`)
2. GREEN: 最小限の実装
3. REFACTOR: スタイル整理、エラー表示改善

#### 成果物
- [ ] `src/components/TextInput.tsx`
- [ ] `__tests__/components/TextInput.test.tsx`
- [ ] テストが全てパス

---

### Task 3: 基本UIコンポーネントの完成

TextInputとButton以外に必要な基本コンポーネント：

#### 3.1 Card コンポーネント
- 日記エントリー表示用
- variant: default, elevated

#### 3.2 ListItem コンポーネント
- 一覧表示用
- タップ可能
- 右矢印アイコン

#### 3.3 VoiceInputButton コンポーネント
- 音声入力のトリガー
- 録音中の視覚フィードバック
- マイクアイコン

各コンポーネントはTDDで実装する。

---

### Task 4: 画面コンポーネントの実装開始

#### 4.1 HomeScreen（日記一覧画面）
**優先度**: 🔴 高

**機能要件**:
- 日記エントリーの一覧表示
- 日付でソート（新しい順）
- エントリータップで詳細画面へ遷移
- 新規作成ボタン

**使用するコンポーネント**:
- Card
- ListItem
- Button（FAB: Floating Action Button）

**使用するストア**:
- diaryStore (エントリー一覧取得)

**テスト**:
- 一覧表示のレンダリング
- エントリータップ時のナビゲーション
- 新規作成ボタンの動作

#### 4.2 DiaryEntryScreen（日記入力画面）
**優先度**: 🔴 高

**機能要件**:
- 質問の順次表示
- テキスト入力 or 音声入力
- 回答の保存
- 入力中の下書き保存

**使用するコンポーネント**:
- TextInput
- VoiceInputButton
- Button

**使用するストア**:
- diaryStore (保存)
- questionStore (質問取得)

**テスト**:
- 質問の表示
- 回答入力
- 保存処理
- 音声入力切替

#### 4.3 SettingsScreen（設定画面）
**優先度**: 🟡 中

**機能要件**:
- リマインダー時間設定
- 質問のカスタマイズ
- エクスポート機能
- ダークモード切替

**使用するストア**:
- settingsStore
- questionStore

---

## 📂 実装ファイル一覧（予定）

### 次セッションで作成予定

```
src/
├── components/
│   ├── Button.tsx               ✅ 完了
│   ├── TextInput.tsx            ⏳ 次回
│   ├── Card.tsx                 ⏳ 次回
│   ├── ListItem.tsx             ⏳ 次回
│   └── VoiceInputButton.tsx     ⏳ 次回
│
├── screens/
│   ├── HomeScreen.tsx           ⏳ 次回
│   ├── DiaryEntryScreen.tsx     ⏳ 次回
│   └── SettingsScreen.tsx       ⏳ 次回（優先度低）
│
└── navigation/
    └── AppNavigator.tsx         ⏳ 次回

__tests__/
├── components/
│   ├── Button.test.tsx          ✅ 完了（実行保留）
│   ├── TextInput.test.tsx       ⏳ 次回
│   ├── Card.test.tsx            ⏳ 次回
│   ├── ListItem.test.tsx        ⏳ 次回
│   └── VoiceInputButton.test.tsx ⏳ 次回
│
└── screens/
    ├── HomeScreen.test.tsx      ⏳ 次回
    └── DiaryEntryScreen.test.tsx ⏳ 次回
```

---

## 🔄 開発フロー（推奨順序）

### 1日目: テスト環境修正 + TextInput
1. React Nativeテスト環境の修正（2-3時間）
2. TextInputコンポーネントの実装（TDD）
3. Button/TextInputのテスト実行確認

### 2日目: 基本UIコンポーネント
1. Card コンポーネント（TDD）
2. ListItem コンポーネント（TDD）
3. VoiceInputButton コンポーネント（TDD）

### 3日目: 画面実装開始
1. ナビゲーション設定
2. HomeScreen 実装（TDD）
3. DiaryEntryScreen 実装（TDD）

### 4日目: 統合・動作確認
1. 画面遷移のテスト
2. エミュレータでの動作確認
3. 修正・リファクタリング

---

## 📝 メモ・気づき

### テスト環境について
- jest-expoのプリセットがExpo SDK 54と衝合している
- 一時的にts-jestベースの設定に戻すことでサービス/ストア層のテストは動作
- UIコンポーネントにはReact Nativeモジュールの適切な変換設定が必要

### コード品質
- 現在のカバレッジ: 93.05%（目標80%を達成）
- サービス層: 99.21%
- ストア層: 85.29%（カバレッジ向上の余地あり）

### TDDの実践
- RED → GREEN → REFACTORサイクルを厳守
- CodeRabbitのレビューで品質向上
- リファクタリング段階での設計改善が効果的

---

## 🔗 関連リンク

- **PR #7**: https://github.com/hawkymisc/dialized-monologue/pull/7
- **Issue #6**: 進捗報告
- **PLAN.md**: 全体計画
- **SPEC.md**: 詳細仕様

---

## ✅ チェックリスト（次回セッション開始時）

- [ ] PR #7がマージされているか確認
- [ ] mainブランチをpull
- [ ] 新しいfeatureブランチを作成（例: `feature/ui-components`）
- [ ] React Nativeテスト環境の修正から開始
- [ ] 各タスク完了後、こまめにコミット
- [ ] TodoWriteツールでタスク管理
- [ ] 5コミットごとに進捗報告Issue作成

---

🤖 Generated with Claude Code
