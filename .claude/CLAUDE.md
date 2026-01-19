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

## ルール

開発プロセスのルールは `.claude/rules/` を参照:
- `tdd.md` - TDDサイクル・チェックリスト
- `git.md` - コミットルール
- `github-issue.md` - 作業報告ルール

---

## 参照ドキュメント
- `PLAN.md` - 開発計画
- `SPEC.md` - 詳細仕様
