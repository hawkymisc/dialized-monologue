# dialized-monologue

## 概要
音声入力対応の日記アプリ（React Native + Expo）

毎日決まった時間にリマインダーが届き、質問に答える形式で日記を記録できる。

## 技術スタック
- **フレームワーク**: React Native + Expo (Managed Workflow)
- **言語**: TypeScript (strict mode)
- **状態管理**: Zustand
- **テスト**: Jest + React Native Testing Library
- **ナビゲーション**: React Navigation

## 開発方針
- TDD（テストファースト）で実装
- 関数コンポーネント + Hooks
- 単一責任の原則を意識

## ディレクトリ構造
```
src/
├── components/    # 再利用可能なUIコンポーネント
├── screens/       # 画面コンポーネント
├── hooks/         # カスタムフック
├── stores/        # Zustand ストア
├── services/      # 外部サービス連携（ストレージ、通知、音声認識）
├── types/         # 型定義
├── utils/         # ユーティリティ関数
└── constants/     # 定数（デフォルト質問など）

__tests__/         # テストファイル
```

## コマンド
```bash
npm start          # 開発サーバー起動
npm test           # テスト実行
npm run test:watch # テスト監視モード
npm run test:coverage # カバレッジ付きテスト
```

## テスト
- `npm test` で実行
- カバレッジ目標: 80%以上
- テストファイルは `__tests__/` または `*.test.ts(x)` に配置

---

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
- [ ] 重複コードはないか？
- [ ] 責務は単一か？
- [ ] 命名は意図を表しているか？
- [ ] テストは読みやすいか？
- [ ] 型定義やSPEC.mdに反映すべき気づきはないか？

### テストが書きにくい = 設計の問題
テストが書きにくいと感じたら、それは設計に問題がある兆候。
無理にテストを書くのではなく、設計を見直す。

---

## コミットルール

### タスク完了ごとにコミット
大きな変更を溜め込まない。細かくコミットする。

### コミットメッセージ形式
```
<type>: <description>

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

type: feat, fix, test, refactor, docs, chore

---

## 作業報告
約5コミットごと、または機能単位完了時に GitHub Issue で報告。

```bash
gh issue create --title "進捗報告: <Phase名> - <概要>" --body "..."
```

---

## 参照ドキュメント
- `PLAN.md` - 開発計画
- `SPEC.md` - 詳細仕様
