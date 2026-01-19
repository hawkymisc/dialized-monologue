# コミットルール

## タスク完了ごとにコミット

各タスク完了時に必ずコミットする。大きな変更を溜め込まない。

```
良い例:
  ✓ feat: DiaryEntry型を定義
  ✓ test: DiaryEntry型のバリデーションテスト追加
  ✓ feat: ストレージサービスの基本実装
  ✓ refactor: ストレージサービスのエラーハンドリング改善

悪い例:
  ✗ feat: 日記機能全部実装
```

## コミットメッセージ形式

```
<type>: <description>

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

### type一覧

- `feat`: 新機能
- `fix`: バグ修正
- `test`: テスト追加・修正
- `refactor`: リファクタリング
- `docs`: ドキュメント変更
- `chore`: ビルド/ツール関連の変更
