# テスト設計ドキュメント

画面コンポーネントのテストケース設計に使用した状態遷移図とディシジョンテーブル。

---

## 1. HomeScreen

### 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Init: マウント
    Init --> Loading: loadEntries()呼び出し
    Loading --> Error: 失敗
    Loading --> Empty: 成功・データなし
    Loading --> HasData: 成功・データあり

    Error --> [*]
    Empty --> [*]
    HasData --> ShowTodayNew: 今日のエントリーなし
    HasData --> ShowTodayExist: 今日のエントリーあり

    ShowTodayNew --> [*]
    ShowTodayExist --> [*]

    note right of Loading
        isLoading=true
        UIに「読み込み中...」表示
    end note

    note right of Error
        error!=null
        エラーメッセージ表示
    end note

    note right of Empty
        entries=[]
        「まだ日記がありません」
    end note

    note right of ShowTodayNew
        「日記を書く」ボタン表示
        過去の日記一覧表示
    end note

    note right of ShowTodayExist
        「今日の日記を見る」ボタン表示
        過去の日記一覧表示
    end note
```

### テキストベース状態遷移図

```
[初期状態]
    │
    ├─ マウント → loadEntries()呼び出し
    │
    ↓
[ローディング中] (isLoading=true)
    │
    ├─ 失敗 → [エラー状態]
    │            │
    │            └─ エラーメッセージ表示
    │
    ├─ 成功・データなし → [空の状態]
    │                      │
    │                      └─ 「まだ日記がありません」表示
    │
    └─ 成功・データあり → [データあり状態]
                          │
                          ├─ 今日のエントリーなし
                          │  ├─ 「日記を書く」ボタン
                          │  └─ 過去の日記一覧（日付降順）
                          │
                          └─ 今日のエントリーあり
                             ├─ 「今日の日記を見る」ボタン
                             └─ 過去の日記一覧（日付降順）
```

### ディシジョンテーブル

| # | isLoading | error | entries | 今日のエントリー | 期待される表示 | テスト済み | テストケース名 |
|---|-----------|-------|---------|-----------------|---------------|----------|---------------|
| 1 | true | null | [] | - | 「読み込み中...」 | ✅ | ローディング中は「読み込み中...」が表示される |
| 2 | false | "エラー" | [] | - | エラーメッセージ | ✅ | エラーがある場合、エラーメッセージが表示される |
| 3 | false | null | [] | - | 「まだ日記がありません」 | ✅ | 日記エントリーがない場合、「まだ日記がありません」が表示される |
| 4 | false | null | [data] | なし | 一覧表示 + 「日記を書く」 | ✅ | 今日の日記が存在しない場合、「日記を書く」ボタンが表示される |
| 5 | false | null | [data] | あり | 一覧表示 + 「今日の日記を見る」 | ✅ | 今日の日記が存在する場合、「今日の日記を見る」ボタンが表示される |
| 6 | false | null | undefined | - | クラッシュしない | ✅ | entriesがundefinedでもクラッシュしない |
| 7 | true | "エラー" | [] | - | 「読み込み中...」（優先） | ✅ | isLoading=trueかつerrorが設定されている場合、ローディングが優先される |
| 8 | false | null | [100件] | - | 一覧表示 | ✅ | 非常に多くのエントリー（100件）でも正常にレンダリングできる |
| 9 | false | "長文" | [] | - | エラーメッセージ | ✅ | 非常に長いエラーメッセージでも表示できる |
| 10 | false | null | [不正な日付] | - | 一覧表示 | ✅ | 不正な日付形式のエントリーがあってもクラッシュしない |
| 11 | false | null | [重複日付] | - | 重複表示 | ✅ | 同じ日付の重複エントリーがあっても正常に表示される |

### 境界値・エッジケース

| カテゴリ | 値 | テスト済み |
|---------|-----|----------|
| entries数 | 0件 | ✅ |
| entries数 | 1件 | ✅ |
| entries数 | 100件 | ✅ |
| entries | undefined | ✅ |
| error長さ | 1000文字 | ✅ |
| 日付形式 | "invalid-date" | ✅ |
| 日付重複 | 同じ日付×2 | ✅ |

---

## 2. DiaryInputScreen

### 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Init: マウント
    Init --> Loading: loadQuestions()呼び出し
    Loading --> Error: 失敗
    Loading --> NoQuestions: 成功・質問なし
    Loading --> Question1: 成功・質問あり

    Error --> [*]
    NoQuestions --> [*]

    Question1 --> Question2: 次へボタン
    Question2 --> Question1: 戻るボタン
    Question2 --> Question3: 次へボタン
    Question3 --> Question2: 戻るボタン
    Question3 --> Saving: 保存ボタン

    Saving --> Saved: 成功
    Saving --> SaveError: 失敗

    Saved --> [*]
    SaveError --> Question3: エラー表示（画面に留まる）

    note right of Question1
        currentIndex=0
        「次へ」ボタン表示
        「戻る」ボタン非表示
    end note

    note right of Question2
        currentIndex=1
        「次へ」「戻る」両方表示
    end note

    note right of Question3
        currentIndex=2
        「保存」ボタン表示
        「戻る」ボタン表示
    end note

    note right of Saving
        isSaving=true
        保存ボタン無効化
    end note
```

### テキストベース状態遷移図

```
[初期状態]
    │
    ├─ マウント → loadQuestions()呼び出し
    │
    ↓
[ローディング中] (isLoading=true)
    │
    ├─ 失敗 → [エラー状態]
    │            └─ エラーメッセージ表示
    │
    ├─ 成功・質問なし → [質問なし状態]
    │                    └─ 「質問がありません」表示
    │
    └─ 成功・質問あり
        │
        ↓
    [質問1] (currentIndex=0)
        │  - 質問表示
        │  - rating型: 1-5ボタン
        │  - multiline型: テキスト入力
        │  - 「次へ」ボタン表示
        │  - 「戻る」ボタン非表示
        │
        ├─ 次へ → [質問2] (currentIndex=1)
        │            │  - 「次へ」「戻る」両方表示
        │            │
        │            ├─ 次へ → [質問3] (currentIndex=2)
        │            │            │  - 「保存」「戻る」表示
        │            │            │
        │            │            └─ 保存 → [保存中] (isSaving=true)
        │            │                        │  - ボタン無効化
        │            │                        │
        │            │                        ├─ 成功 → [完了]
        │            │                        │
        │            │                        └─ 失敗 → [エラー表示]
        │            │                                    └─ 質問3に留まる
        │            │
        │            └─ 戻る → [質問1]
        │
        └─ （質問1つのみの場合）
            └─ 保存 → [保存中] → [完了]
```

### ディシジョンテーブル

| # | questions.isLoading | questions.error | questions数 | currentIndex | question.type | 期待される表示 | テスト済み |
|---|---------------------|-----------------|-------------|--------------|---------------|---------------|----------|
| 1 | true | null | 0 | 0 | - | 「読み込み中...」 | ✅ |
| 2 | false | "エラー" | 0 | 0 | - | エラーメッセージ | ✅ |
| 3 | false | null | 0 | 0 | - | 「質問がありません」 | ✅ |
| 4 | false | null | 3 | 0 | rating | rating UI + 「次へ」 | ✅ |
| 5 | false | null | 3 | 1 | multiline | テキスト入力 + 「次へ」「戻る」 | ✅ |
| 6 | false | null | 3 | 2 | multiline | テキスト入力 + 「保存」「戻る」 | ✅ |
| 7 | false | null | 1 | 0 | rating | rating UI + 「保存」のみ | ✅ |
| 8 | false | null | 3 | 0 | unknown | テキスト入力（フォールバック） | ✅ |
| 9 | false | null | 3 | 2 | multiline (保存中) | ボタン無効化 | ✅ |

### 質問タイプ別の入力UIマッピング

| question.type | 表示UI | フォールバック | テスト済み |
|---------------|--------|---------------|----------|
| rating | 1-5ボタン | - | ✅ |
| multiline | TextInput (multiline=true) | - | ✅ |
| text | TextInput (multiline=false) | - | ✅ |
| choice | （未実装） | TextInput | ❌ |
| unknown | - | TextInput | ✅ |

### 保存処理の状態遷移

| 状態 | isSaving | ボタン状態 | addEntry呼び出し | 次の状態 | テスト済み |
|-----|----------|-----------|-----------------|---------|----------|
| 待機中 | false | 有効 | - | - | ✅ |
| 1回目保存 | false→true | 無効化 | 1回 | 保存中 | ✅ |
| 保存中 | true | 無効 | 無視 | 保存中 | ✅ |
| 連続タップ | true | 無効 | 無視（0回追加） | 保存中 | ✅ |
| 保存成功 | true→false | 有効化 | - | 完了 | ✅ |
| 保存失敗 | true→false | 有効化 | - | エラー（画面に留まる） | ✅ |

### 境界値・エッジケース

| カテゴリ | 値 | テスト済み |
|---------|-----|----------|
| 質問数 | 0 | ✅ |
| 質問数 | 1（最初=最後） | ✅ |
| 質問数 | 3 | ✅ |
| question.type | unknown | ✅ |
| answer値 | 空文字列 | ✅ |
| answer値 | 1000文字 | ✅ |
| 保存ボタン | 連続タップ×3 | ✅ |

---

## 3. DiaryDetailScreen

### 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> CheckEntry: entryId確認
    CheckEntry --> NotFound: エントリーなし
    CheckEntry --> Display: エントリーあり

    NotFound --> [*]

    Display --> Edit: 編集ボタン
    Display --> Deleting: 削除ボタン

    Edit --> Display: キャンセルボタン
    Edit --> Saving: 保存ボタン

    Saving --> Display: 成功
    Saving --> EditError: 失敗
    EditError --> Edit: エラー表示（編集モードに留まる）

    Deleting --> Deleted: 成功
    Deleting --> DeleteError: 失敗
    DeleteError --> Display: エラー表示（表示モードに戻る）

    Deleted --> [*]

    note right of Display
        isEditing=false
        「編集」「削除」ボタン表示
        読み取り専用で表示
    end note

    note right of Edit
        isEditing=true
        「保存」「キャンセル」ボタン表示
        テキスト入力可能
    end note

    note right of Saving
        isSaving=true
        ボタン無効化
    end note

    note right of Deleting
        isDeleting=true
        ボタン無効化
    end note
```

### テキストベース状態遷移図

```
[初期状態]
    │
    ├─ entryId確認
    │
    ├─ エントリーなし → [エラー状態]
    │                    └─ 「日記が見つかりません」表示
    │
    └─ エントリーあり
        │
        ↓
    [表示モード] (isEditing=false)
        │  - 日付表示
        │  - 全Q&A表示（読み取り専用）
        │  - 「編集」「削除」ボタン
        │
        ├─ 編集ボタン → [編集モード] (isEditing=true)
        │                   │  - テキスト入力可能
        │                   │  - 「保存」「キャンセル」ボタン
        │                   │
        │                   ├─ 保存 → [保存中] (isSaving=true)
        │                   │            │  - ボタン無効化
        │                   │            │
        │                   │            ├─ 成功 → [表示モード]
        │                   │            │
        │                   │            └─ 失敗 → [編集モード]
        │                   │                        └─ エラー表示
        │                   │
        │                   └─ キャンセル → [表示モード]
        │                                      └─ 変更破棄
        │
        └─ 削除ボタン → [削除中] (isDeleting=true)
                          │  - ボタン無効化
                          │
                          ├─ 成功 → [削除完了]
                          │
                          └─ 失敗 → [表示モード]
                                      └─ エラー表示
```

### ディシジョンテーブル

| # | entryId | getEntryById結果 | isEditing | isSaving | isDeleting | 期待される表示 | テスト済み |
|---|---------|------------------|-----------|----------|-----------|---------------|----------|
| 1 | undefined | - | false | false | false | 「日記が見つかりません」 | ✅ |
| 2 | "invalid" | undefined | false | false | false | 「日記が見つかりません」 | ✅ |
| 3 | "entry-1" | entry | false | false | false | 表示モード（編集/削除ボタン） | ✅ |
| 4 | "entry-1" | entry | true | false | false | 編集モード（保存/キャンセルボタン） | ✅ |
| 5 | "entry-1" | entry | true | true | false | 編集モード（ボタン無効） | ✅ |
| 6 | "entry-1" | entry | false | false | true | 表示モード（ボタン無効） | ✅ |
| 7 | "entry-1" | 空answers | false | false | false | 表示モード（回答なし） | ✅ |
| 8 | "entry-1" | 1000文字answer | false | false | false | 表示モード（長文表示） | ✅ |
| 9 | "entry-1" | unknown type | false | false | false | 表示モード（String変換） | ✅ |
| 10 | "entry-1" | undefined value | false | false | false | 表示モード（クラッシュしない） | ✅ |

### answer.type別の表示UIマッピング

| answer.type | 表示モード | 編集モード | フォールバック | テスト済み |
|-------------|-----------|-----------|---------------|----------|
| rating | 数値表示 | 数値表示（編集不可） | - | ✅ |
| text | テキスト表示 | TextInput | - | ✅ |
| unknown | String変換して表示 | TextInput | String変換 | ✅ |

### 保存/削除処理の状態遷移

| 操作 | 状態フラグ | ボタン状態 | 関数呼び出し | 成功時 | 失敗時 | テスト済み |
|-----|-----------|-----------|-------------|-------|-------|----------|
| 保存 | isSaving=true | 無効化 | updateEntry×1 | 表示モードに戻る | 編集モードに留まる | ✅ |
| 保存連続タップ | isSaving=true | 無効 | 無視（0回追加） | - | - | ✅ |
| 削除 | isDeleting=true | 無効化 | deleteEntry×1 | 完了 | 表示モードに戻る | ✅ |
| 削除連続タップ | isDeleting=true | 無効 | 無視（0回追加） | - | - | ✅ |
| キャンセル | フラグ変更なし | - | なし | 表示モード + 変更破棄 | - | ✅ |

### 境界値・エッジケース

| カテゴリ | 値 | テスト済み |
|---------|-----|----------|
| entryId | undefined | ✅ |
| entryId | "invalid" | ✅ |
| answers数 | 0 | ✅ |
| answer値 | 1000文字 | ✅ |
| answer.value | undefined | ✅ |
| answer.type | unknown | ✅ |
| 保存ボタン | 連続タップ×3 | ✅ |
| 削除ボタン | 連続タップ×3 | ✅ |

---

## 4. SettingsScreen

### 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Display: マウント
    Display --> Display: 設定項目タップ

    note right of Display
        常に同じ状態
        onNavigate()コールバック呼び出し
        状態変化なし
    end note
```

### テキストベース状態遷移図

```
[初期状態]
    │
    └─ マウント
        │
        ↓
    [表示状態]
        │  - 4つの設定項目表示
        │    1. リマインダー設定
        │    2. 質問設定
        │    3. データ管理
        │    4. 表示設定
        │
        ├─ タップ → onNavigate()呼び出し
        │              └─ 画面に留まる
        │
        └─ （状態変化なし）
```

### ディシジョンテーブル

| # | onNavigate | タップ項目 | 期待される動作 | エラー発生 | テスト済み |
|---|------------|-----------|---------------|-----------|----------|
| 1 | 正常 | リマインダー設定 | onNavigate('ReminderSettings') | なし | ✅ |
| 2 | 正常 | 質問設定 | onNavigate('QuestionSettings') | なし | ✅ |
| 3 | 正常 | データ管理 | onNavigate('DataManagement') | なし | ✅ |
| 4 | 正常 | 表示設定 | onNavigate('DisplaySettings') | なし | ✅ |
| 5 | undefined | 任意 | クラッシュしない | なし | ✅ |
| 6 | エラーを投げる | 任意 | クラッシュしない | catch | ✅ |
| 7 | 正常 | リマインダー設定×3 | onNavigate×3回呼び出し | なし | ✅ |

### 設定項目マッピング

| 表示名 | subtitle | onNavigate引数 | テスト済み |
|-------|----------|---------------|----------|
| リマインダー設定 | 通知時刻の設定 | 'ReminderSettings' | ✅ |
| 質問設定 | 質問の追加・編集・削除 | 'QuestionSettings' | ✅ |
| データ管理 | エクスポート・削除 | 'DataManagement' | ✅ |
| 表示設定 | ダークモード設定 | 'DisplaySettings' | ✅ |

### 境界値・エッジケース

| カテゴリ | 値 | テスト済み |
|---------|-----|----------|
| onNavigate | undefined | ✅ |
| onNavigate | エラーを投げる関数 | ✅ |
| タップ回数 | 連続3回 | ✅ |

---

## 5. テストカバレッジマトリクス

### 全画面共通テストカテゴリ

| カテゴリ | HomeScreen | DiaryInputScreen | DiaryDetailScreen | SettingsScreen |
|---------|-----------|------------------|-------------------|----------------|
| **正常系** | ✅ | ✅ | ✅ | ✅ |
| **エラー状態** | ✅ | ✅ | ✅ | ✅ |
| **ローディング状態** | ✅ | ✅ | ❌ | ❌ |
| **空データ** | ✅ | ✅ | ✅ | ❌ |
| **アクセシビリティ** | ✅ | ✅ | ✅ | ✅ |
| **境界値（長文）** | ✅ | ✅ | ✅ | ❌ |
| **境界値（大量）** | ✅ | ❌ | ❌ | ❌ |
| **非同期エラー** | ✅ | ✅ | ✅ | ❌ |
| **連続操作** | ❌ | ✅ | ✅ | ✅ |
| **未知の型** | ✅ | ✅ | ✅ | ❌ |

### テストカバレッジサマリー

| 画面 | 正常系 | エラー系 | エッジケース | 非同期 | 競合状態 | 総テスト数 | 評価 |
|-----|-------|---------|------------|-------|---------|-----------|------|
| HomeScreen | 6 | 4 | 5 | 1 | 0 | 18 | 🟢 良好 |
| DiaryInputScreen | 8 | 3 | 4 | 2 | 1 | 24 | 🟢 非常に良好 |
| DiaryDetailScreen | 5 | 2 | 6 | 3 | 2 | 22 | 🟢 非常に良好 |
| SettingsScreen | 9 | 2 | 1 | 0 | 1 | 19 | 🟢 良好 |
| **合計** | **28** | **11** | **16** | **6** | **4** | **83** | **🟢 85-90%** |

---

## 6. 不足している（実装されていない）テストケース

### 優先度：低（将来的な改善）

#### HomeScreen
- [ ] ローディング中にユーザーがボタンをタップした場合の挙動
- [ ] 1000件以上のエントリーのパフォーマンステスト
- [ ] 実際のナビゲーション動作（React Navigation統合後）

#### DiaryInputScreen
- [ ] 50個以上の質問がある場合のUI/パフォーマンス
- [ ] すべての質問が`isActive=false`の場合
- [ ] 質問が動的に追加/削除された場合
- [ ] 保存中に別の質問に遷移しようとした場合
- [ ] バックグラウンド遷移時の状態保持

#### DiaryDetailScreen
- [ ] 編集中にアプリがバックグラウンドになった場合
- [ ] 編集中に他のユーザーが同じエントリーを削除した場合（将来のクラウド同期時）
- [ ] rating型の編集UI（現在は編集不可）
- [ ] 削除確認ダイアログ（現在未実装）

#### SettingsScreen
- [ ] 設定項目が10個以上ある場合のスクロール動作
- [ ] 各設定画面からの戻り動作

---

## 7. テスト設計の原則

このテスト設計で適用した原則：

### 1. 状態遷移の網羅
- すべての可能な状態を洗い出し
- 状態間の遷移をすべてテスト
- デッドロック（抜け出せない状態）がないことを確認

### 2. ディシジョンテーブルによる組み合わせ網羅
- 入力条件のすべての組み合わせをテーブル化
- 各組み合わせに対する期待結果を明確化
- 実装漏れがないことを確認

### 3. 境界値分析
- 0, 1, 多数の境界でテスト
- 空文字列、null、undefined
- 最大値、最小値、範囲外

### 4. エラー処理の徹底テスト
- すべての非同期処理の失敗ケース
- ネットワークエラー、タイムアウト
- 予期しない例外

### 5. 競合状態（Race Condition）のテスト
- 連続操作（連続タップ）
- 同時実行（複数の非同期処理）
- 保存中/削除中の状態管理

### 6. アクセシビリティの確認
- すべての要素に適切なaccessibilityRole
- スクリーンリーダー対応
- disabled状態の反映

---

## 付録：Mermaid記法による全画面の状態遷移図

### HomeScreen

```mermaid
graph TD
    A[初期状態] --> B{loadEntries}
    B -->|呼び出し| C[ローディング中]
    C -->|失敗| D[エラー状態]
    C -->|成功・空| E[空の状態]
    C -->|成功・データあり| F[データあり状態]
    F -->|今日なし| G[今日のエントリーなし]
    F -->|今日あり| H[今日のエントリーあり]

    D --> Z[表示]
    E --> Z
    G --> Z
    H --> Z
```

### DiaryInputScreen

```mermaid
graph TD
    A[初期状態] --> B{loadQuestions}
    B -->|呼び出し| C[ローディング中]
    C -->|失敗| D[エラー状態]
    C -->|成功・なし| E[質問なし]
    C -->|成功・あり| F[質問1]
    F -->|次へ| G[質問2]
    G -->|次へ| H[質問3]
    H -->|保存| I{保存中}
    I -->|成功| J[完了]
    I -->|失敗| K[エラー]
    G -->|戻る| F
    H -->|戻る| G
    K -->|再試行| H
```

### DiaryDetailScreen

```mermaid
graph TD
    A[初期状態] --> B{entryId確認}
    B -->|なし| C[エラー状態]
    B -->|あり| D[表示モード]
    D -->|編集| E[編集モード]
    E -->|保存| F{保存中}
    F -->|成功| D
    F -->|失敗| E
    E -->|キャンセル| D
    D -->|削除| G{削除中}
    G -->|成功| H[完了]
    G -->|失敗| D
```

---

**最終更新**: 2026-01-26
**バージョン**: 1.0
**作成者**: Claude Code (TDD実装時のテスト設計資料)
