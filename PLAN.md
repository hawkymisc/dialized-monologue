# 日記アプリ開発計画

## プロジェクト概要
**dialized-monologue** - 毎日決まった時間にリマインダーで質問に答える形式の日記アプリ（音声入力対応）

## プロジェクトパス
`/Users/wakamatsudaiki/Projects/dialized-monologue`

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

#### Step 1: 基盤層
1. **型定義** (`types/`) - DiaryEntry, Question, Settings
2. **ストレージサービス** (`services/storage.ts`) - AsyncStorage wrapper
   - → Refactor後: 型定義の使い勝手を評価、必要なら修正

#### Step 2: ドメインロジック
3. **日記ストア** (`stores/diaryStore.ts`) - CRUD操作
4. **質問ストア** (`stores/questionStore.ts`) - 質問管理
5. **設定ストア** (`stores/settingsStore.ts`) - リマインダー時間等
   - → Refactor後: ストア間の共通パターンを抽出検討

#### Step 3: サービス層
6. **通知サービス** (`services/notification.ts`) - リマインダー
7. **音声認識サービス** (`services/speech.ts`) - 音声→テキスト
8. **エクスポートサービス** (`services/export.ts`) - JSON/CSV出力
   - → Refactor後: エラーハンドリングパターンの統一

#### Step 4: UI層
9. **入力コンポーネント** - テキスト/音声切替
10. **日記一覧画面** - 過去の日記表示
11. **日記入力画面** - 質問に回答
12. **設定画面** - リマインダー時間設定
    - → Refactor後: 共通UIパターンのコンポーネント化

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

| # | タスク | 成果物 |
|---|--------|--------|
| 0 | **PLAN.md保存** | `PLAN.md`（この計画をプロジェクトに保存） |
| 1 | SPEC.md作成 | `SPEC.md` |
| 2 | Expoプロジェクト作成 | プロジェクト骨格 |
| 3 | CLAUDE.md作成 | `.claude/CLAUDE.md` |
| 4 | Agent Skills調査・導入 | 必要に応じてインストール |
| 5 | 型定義 + テスト | `src/types/`, `__tests__/` |
| 6 | ストレージ層 + テスト | `src/services/storage.ts` |
| 7 | 各ストア + テスト | `src/stores/` |
| 8 | 通知サービス + テスト | `src/services/notification.ts` |
| 9 | 音声認識 + テスト | `src/services/speech.ts` |
| 10 | UIコンポーネント + テスト | `src/components/`, `src/screens/` |
| 11 | 結合テスト・動作確認 | E2Eテスト |
| 12 | 受け入れテスト | ユーザーフィードバック反映 |
