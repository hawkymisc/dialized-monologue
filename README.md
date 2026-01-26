# dialized-monologue

毎日決まった時間にリマインダーで質問に答える形式の日記アプリ（React Native + Expo）

## 概要

**dialized-monologue**は、質問に答えるだけで日記を記録できるモバイルアプリケーションです。音声入力に対応し、手軽に日々の振り返りを行えます。

### 主な機能

- 📅 **リマインダー機能**: 毎日決まった時間に通知
- 🗣️ **音声入力**: OS標準の音声認識でハンズフリー記録
- ✏️ **質問形式の日記**: カスタマイズ可能な質問セット
- 📊 **日記閲覧**: 過去の日記の検索・閲覧
- 💾 **データエクスポート**: JSON/CSV形式で保存
- ♿ **アクセシビリティ**: VoiceOver/TalkBack対応

## 技術スタック

- **フレームワーク**: React Native + Expo (Managed Workflow)
- **言語**: TypeScript (strict mode)
- **状態管理**: Zustand
- **テスト**: Jest + React Native Testing Library
- **ナビゲーション**: React Navigation

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- Expo CLI
- iOS Simulator / Android Emulator または実機

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start

# iOS Simulatorで起動
npm run ios

# Android Emulatorで起動
npm run android
```

## 開発ガイド

### ディレクトリ構造

```
src/
├── components/       # 再利用可能なUIコンポーネント
│   ├── Button.tsx
│   ├── TextInput.tsx
│   ├── ListItem.tsx
│   ├── VoiceInputButton.tsx
│   └── Card.tsx
├── screens/          # 画面コンポーネント
├── hooks/            # カスタムフック
├── stores/           # Zustand ストア
│   ├── diaryStore.ts
│   ├── questionStore.ts
│   └── settingsStore.ts
├── services/         # 外部サービス連携
│   ├── storage.ts
│   ├── notification.ts
│   ├── speech.ts
│   └── export.ts
├── types/            # 型定義
├── utils/            # ユーティリティ関数
└── constants/        # 定数
```

### テスト

```bash
# テスト実行
npm test

# テスト監視モード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

**カバレッジ目標**: 80%以上（現在: 93.98%）

### 開発方針

- **TDD（Test Driven Development）**: テストファーストで実装
- **関数コンポーネント + Hooks**: クラスコンポーネントは使用しない
- **単一責任の原則**: 1つのコンポーネント/関数は1つの責務のみを持つ

## ドキュメント

- [PLAN.md](./PLAN.md) - 開発計画と実装状況
- [SPEC.md](./SPEC.md) - 詳細仕様
- [.claude/CLAUDE.md](./.claude/CLAUDE.md) - プロジェクト固有のルール

## Git Workflow

このプロジェクトはfeatureブランチベースで開発します。

```bash
# featureブランチを作成
git checkout -b feature/<feature-name>

# 変更をコミット
git commit -m "feat: 機能の説明"

# プルリクエストを作成
gh pr create --title "タイトル" --body "説明"
```

詳細は [.claude/rules/git.md](./.claude/rules/git.md) を参照。

## ライセンス

Private

## 開発者

このプロジェクトは Claude Code の支援により開発されています。
