# 作業報告（GitHub Issue）

## 報告タイミング

- 約5コミットごと、または1つの機能単位が完了したタイミング
- 各Phaseの完了時

## Issue作成コマンド

```bash
gh issue create --title "進捗報告: <Phase名> - <概要>" --body "..."
```

## Issue本文テンプレート

```markdown
## 作業報告

### 完了したタスク
- [ ] タスク1
- [ ] タスク2
- [ ] タスク3

### 関連コミット
- `abc1234` feat: xxx
- `def5678` test: xxx
- `ghi9012` refactor: xxx

### 次のステップ
- 次に取り組む内容

### 備考・気づき
- 実装中に気づいた点や設計変更など

---
🤖 Generated with Claude Code
```

## ラベル

- `progress-report`: 進捗報告
- `phase-1`, `phase-2`, etc.: フェーズごとのラベル
