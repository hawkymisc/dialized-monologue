# 日記アプリ開発計画

## プロジェクト概要
**dialized-monologue** - 毎日決まった時間にリマインダーで質問に答える形式の日記アプリ（音声入力対応）

## プロジェクトパス
`/home/hiroki-wakamatsu/Projects/dialized-monologue`

## 技術スタック
- **フレームワーク**: React Native + Expo (Managed Workflow)
- **言語**: TypeScript
- **テスト**: Jest + React Native Testing Library (TDD)
- **状態管理**: Zustand（軽量でシンプル）

---

## Phase 1: 要件定義 (SPEC.md作成)

### 機能要件（仮定を含む）

#### 1. リマインダー機能
- ユーザーが自由に時間を設定可能
- 複数時間の設定も可能（朝・夜など）
- expo-notifications を使用

#### 2. 質問形式の日記
- デフォルト質問セット提供
- ユーザーによる質問のカスタマイズ可能
- 例: 「今日の気分は？」「今日あった良いことは？」「明日の目標は？」

#### 3. 音声入力
- OS標準の音声認識API使用（expo-speech または react-native-voice）
- オフラインでも動作
- テキスト入力との切り替え可能

#### 4. データ保存
- ローカルストレージ（AsyncStorage / SQLite）
- JSON/CSVエクスポート機能

#### 5. UI/UX
- シンプルで直感的なインターフェース
- 過去の日記一覧・検索機能
- ダークモード対応

---

## Phase 2: プロジェクトセットアップ

### 2.1 Expoプロジェクト作成
```bash
cd /Users/wakamatsudaiki/Projects
npx create-expo-app@latest dialized-monologue --template expo-template-blank-typescript
```

### 2.2 CLAUDE.md作成内容
```markdown
# dialized-monologue

## 概要
音声入力対応の日記アプリ（React Native + Expo）

## 開発方針
- TDD（テストファースト）で実装
- TypeScript strict mode
- 関数コンポーネント + Hooks

## ディレクトリ構造
src/
├── components/    # UIコンポーネント
├── screens/       # 画面
├── hooks/         # カスタムフック
├── stores/        # Zustand ストア
├── services/      # 外部サービス連携
├── types/         # 型定義
└── utils/         # ユーティリティ

## テスト
- `npm test` で実行
- カバレッジ目標: 80%以上

## TDD: Red → Green → Refactor → Feedback

### 必須プロセス
1. **RED**: 失敗するテストを先に書く
2. **GREEN**: 最小限のコードでテストを通す（美しさは後回し）
3. **REFACTOR**: 必ず実施。重複除去、命名改善、責務分離
4. **FEEDBACK**: 実装中の気づきを設計に反映

### Refactorを省略しない
Claudeは一発で動くコードを書きがちだが、TDDの本質的価値は
「実装しながらの気づきによる設計へのフィードバック」である。

各機能実装後、必ず以下を確認：
- 重複コードはないか？
- 責務は単一か？
- 命名は意図を表しているか？
- テストは読みやすいか？
- 型定義やSPEC.mdに反映すべき気づきはないか？

### テストが書きにくい = 設計の問題
テストが書きにくいと感じたら、それは設計に問題がある兆候。
無理にテストを書くのではなく、設計を見直す。
```

### 2.3 必要なライブラリ
| パッケージ | 用途 |
|-----------|------|
| expo-notifications | リマインダー通知 |
| @react-native-voice/voice | 音声認識 |
| @react-native-async-storage/async-storage | データ保存 |
| expo-file-system + expo-sharing | エクスポート |
| @react-navigation/native | 画面遷移 |
| zustand | 状態管理 |
| date-fns | 日付操作 |

---

## Phase 3: Agent Skills / Sub-agent 調査

Web検索で以下を調査:
- Expo/React Native向けのClaude Code Skills（MCP server等）
- セキュリティ確認（npm audit、ライブラリの信頼性）

---

## Phase 4: TDD実装

TDDサイクル・チェックリストは `.claude/rules/tdd.md` を参照。

### 実装順序

#### Step 1: 基盤層 ✅ 完了
1. ✅ **型定義** (`types/index.ts`) - DiaryEntry, Question, Settings
   - テスト: 100% Stmts / 93.33% Branch / 100% Funcs / 100% Lines
   - Refactor完了: 型ガード関数、ファクトリ関数を追加
2. ✅ **ストレージサービス** (`services/storage.ts`) - AsyncStorage wrapper
   - テスト: 100%カバレッジ (全指標)
   - Refactor完了: エラーハンドリング統一

#### Step 2: ドメインロジック ✅ 完了
3. ✅ **日記ストア** (`stores/diaryStore.ts`) - CRUD操作
   - テスト: 88.23% Stmts / 25% Branch / 100% Funcs / 88.88% Lines
4. ✅ **質問ストア** (`stores/questionStore.ts`) - 質問管理
   - テスト: 83.33% Stmts / 20% Branch / 93.75% Funcs / 82.22% Lines
5. ✅ **設定ストア** (`stores/settingsStore.ts`) - リマインダー時間等
   - テスト: 82.97% Stmts / 6.25% Branch / 92.3% Funcs / 82.22% Lines
   - Refactor完了: ストア構造の統一

#### Step 3: サービス層 ✅ 完了
6. ✅ **通知サービス** (`services/notification.ts`) - リマインダー
   - テスト: 95.83% Stmts / 100% Branch / 88.88% Funcs / 95.65% Lines
7. ✅ **音声認識サービス** (`services/speech.ts`) - 音声→テキスト
   - テスト: 100%カバレッジ (全指標)
8. ✅ **エクスポートサービス** (`services/export.ts`) - JSON/CSV出力
   - テスト: 100%カバレッジ (全指標)
   - RFC 4180準拠のCSVエスケープ実装
   - Refactor完了: `generateExportFilename()`をdate.tsから再利用
9. ✅ **日付ユーティリティ** (`utils/date.ts`) - 日付操作
   - テスト: 96% Stmts / 87.5% Branch / 100% Funcs / 95.83% Lines
   - date-fnsライブラリ活用
10. ✅ **デフォルト質問定数** (`constants/defaultQuestions.ts`)
    - テスト: 100%カバレッジ (全指標)

#### Step 4: UI層 ✅ 完了
11. ✅ **Buttonコンポーネント** (`components/Button.tsx`)
    - テスト: 100% Stmts / 86.66% Branch / 100% Funcs / 100% Lines
    - variant対応（primary/secondary/outline）
    - アクセシビリティ対応
12. ✅ **TextInputコンポーネント** (`components/TextInput.tsx`)
    - テスト: 100%カバレッジ (全指標)
    - label、error、multiline対応
    - アクセシビリティ対応
13. ✅ **ListItemコンポーネント** (`components/ListItem.tsx`)
    - テスト: 100% Stmts / 78.57% Branch / 100% Funcs / 100% Lines
    - タップ可能な一覧アイテム
    - subtitle、showArrow対応
14. ✅ **VoiceInputButtonコンポーネント** (`components/VoiceInputButton.tsx`)
    - テスト: 100% Stmts / 93.33% Branch / 100% Funcs / 100% Lines
    - 録音中のパルスアニメーション
    - recording状態の視覚フィードバック
15. ✅ **Cardコンポーネント** (`components/Card.tsx`)
    - テスト: 100% Stmts / 80% Branch / 100% Funcs / 100% Lines
    - variant対応（default/elevated）
    - タップ可能/タップ不可の両対応

**UIコンポーネントの全体カバレッジ**: 100% Stmts / 87.32% Branch / 100% Funcs / 100% Lines

#### Step 5: 画面コンポーネント ⏳ 次のステップ
16. ⏳ **ホーム画面** - 日記一覧表示
17. ⏳ **日記入力画面** - 質問に回答
18. ⏳ **日記詳細画面** - 過去の日記閲覧/編集
19. ⏳ **設定画面** - リマインダー時間設定
    - → Refactor後: 共通UIパターンのコンポーネント化

#### 全体のテストカバレッジ (最終更新: 2026-01-26)

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   93.98 |    72.34 |   97.45 |   93.93 |
 components            |     100 |    87.32 |     100 |     100 |
 constants             |     100 |      100 |     100 |     100 |
 services              |   99.18 |      100 |   97.91 |   99.15 |
 stores                |   84.49 |    16.66 |   95.55 |   83.76 |
 types                 |     100 |    93.33 |     100 |     100 |
 utils                 |      96 |     87.5 |     100 |   95.83 |
-----------------------|---------|----------|---------|---------|
Test Suites: 14 passed, 14 total
Tests:       217 passed, 217 total
```

**注意**: Branchカバレッジが目標80%に未達（72.34%）。主にstoresのブランチカバレッジ（16.66%）が低い。将来的な改善余地あり。

---

## Phase 5: 受け入れテスト（Acceptance Test）

### 概要
ユーザー（ヒト）が実際にアプリを操作し、要件を満たしているか確認する。
問題があればフィードバックを受け、Claudeが修正する。

### 受け入れテスト項目

#### 1. リマインダー機能
- [ ] 指定した時間に通知が届くか
- [ ] 複数の時間を設定できるか
- [ ] 通知をタップするとアプリが開くか

#### 2. 日記入力
- [ ] 質問が順番に表示されるか
- [ ] 回答を入力・保存できるか
- [ ] 音声入力で文字が入力されるか
- [ ] 音声とテキスト入力を切り替えられるか

#### 3. 日記閲覧
- [ ] 過去の日記一覧が表示されるか
- [ ] 日記の詳細を閲覧できるか
- [ ] 検索機能は動作するか

#### 4. 設定
- [ ] リマインダー時間を変更できるか
- [ ] 質問をカスタマイズできるか
- [ ] データをエクスポートできるか

#### 5. 全体的なUX
- [ ] 操作は直感的か
- [ ] 動作は十分に速いか
- [ ] エラー時のメッセージは分かりやすいか

### フィードバックサイクル
```
┌──────────────────────────────────────────────────┐
│  1. ユーザーがアプリを操作                        │
│  2. 問題点・改善点をフィードバック                │
│  3. Claudeが修正（TDDサイクルで）                 │
│  4. テスト通過を確認                              │
│  5. コミット                                      │
│  6. → 1に戻る（問題がなくなるまで）               │
└──────────────────────────────────────────────────┘
```

---

## ルール

開発プロセスのルールは `.claude/rules/` を参照:
- `tdd.md` - TDDサイクル・チェックリスト
- `git.md` - コミットルール
- `github-issue.md` - 作業報告ルール

---

## 検証方法
1. `npm test` - 全テスト実行（カバレッジ確認）
2. `npx expo start` - ローカル開発サーバー起動
3. iOS Simulator / Android Emulator で動作確認
4. 実機でプッシュ通知テスト（Expo Go使用）
5. **Phase 5: ユーザーによる受け入れテスト**

---

## 実装タスク一覧

| # | タスク | 成果物 | 状況 |
|---|--------|--------|------|
| 0 | **PLAN.md保存** | `PLAN.md` | ✅ |
| 1 | SPEC.md作成 | `SPEC.md` | ✅ |
| 2 | Expoプロジェクト作成 | プロジェクト骨格 | ✅ |
| 3 | CLAUDE.md作成 | `.claude/CLAUDE.md` | ✅ |
| 4 | Agent Skills調査・導入 | 必要に応じてインストール | ✅ |
| 5 | 型定義 + テスト | `src/types/`, `__tests__/` | ✅ |
| 6 | ストレージ層 + テスト | `src/services/storage.ts` | ✅ |
| 7 | 各ストア + テスト | `src/stores/` | ✅ |
| 8 | 通知サービス + テスト | `src/services/notification.ts` | ✅ |
| 9 | 音声認識 + テスト | `src/services/speech.ts` | ✅ |
| 10 | エクスポート + テスト | `src/services/export.ts` | ✅ |
| 11 | 日付ユーティリティ + テスト | `src/utils/date.ts` | ✅ |
| 12 | デフォルト質問 | `src/constants/defaultQuestions.ts` | ✅ |
| 13 | UIコンポーネント + テスト | `src/components/` (5コンポーネント) | ✅ |
| 14 | 画面コンポーネント | `src/screens/` | ⏳ 次のステップ |
| 15 | カスタムフック | `src/hooks/` | ⏳ |
| 16 | ナビゲーション統合 | React Navigation設定 | ⏳ |
| 17 | 結合テスト・動作確認 | E2Eテスト | ⏳ |
| 18 | 受け入れテスト | ユーザーフィードバック反映 | ⏳ |
