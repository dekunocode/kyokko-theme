[English](README.md) | 日本語

# Kyokko Theme

**Kyokko（極光）** は、夜空のオーロラをイメージした紺色のダークテーマです。落ち着いた紺の背景に、シアンと緑がオーロラのように浮かびます。

![Visual Studio 2026 で Kyokko を適用した C# のコード](vs/marketplace/csharp-editor.png)

## 特徴

- **日本語コメントが読みやすい**：コメントは斜体にせず、青みのあるグレーで表示します。斜体で崩れがちな日本語も、そのままの形で読めます。
- **目にやさしいコントラスト**：コードの文字色はすべて背景に対して 5.9:1 以上（WCAG AA 基準の 4.5:1 を上回る）を確保しています。
- **グレーのない紺の画面**：Visual Studio と VS Code では、ツールウィンドウやタブ、ステータスバーまで紺の階調でまとめています。
- **色の意味はそのまま**：エラーは赤、警告や検索の一致、デバッグの停止行は金など、見慣れた意味の色を暗めのトーンで残しています。
- **色分け**：キーワードはシアン、関数は緑、型は空色、文字列は砂色、数値は薄紫です。

## 対応環境

| 対象 | 状況 | ファイル |
| --- | --- | --- |
| Visual Studio 2026 | [Visual Studio Marketplace で公開中](https://marketplace.visualstudio.com/items?itemName=dekunocode.KyokkoTheme) | `vs/` |
| VS Code | [Visual Studio Marketplace で公開中](https://marketplace.visualstudio.com/items?itemName=dekunocode.kyokko-theme) | `vscode/` |
| Zed | 公式拡張への登録を申請中（[zed-industries/extensions#8157](https://github.com/zed-industries/extensions/pull/8157)、レビュー待ち） | `zed/` |
| Windows Terminal | 利用可能 | `themes/windows-terminal/kyokko.json` |

## インストール

- **Visual Studio 2026**：[Marketplace](https://marketplace.visualstudio.com/items?itemName=dekunocode.KyokkoTheme) から **Kyokko Theme** をインストールします（**拡張機能 > 拡張機能の管理** で「Kyokko」を検索しても見つかります）。Visual Studio を再起動し、**ツール > テーマ > Kyokko** を選びます。
- **VS Code**：[Marketplace](https://marketplace.visualstudio.com/items?itemName=dekunocode.kyokko-theme) から **Kyokko Theme** をインストールします（拡張機能ビューで「Kyokko」を検索しても見つかります）。**基本設定: 配色テーマ**（`Ctrl+K Ctrl+T`）で **Kyokko** を選びます。
- **Zed** と **Windows Terminal**：[後述](#zed)の手順を参照してください。

## 配色

| 役割 | 色 |
| --- | --- |
| 背景 / 面 / 選択範囲 | `#0f1c2e` / `#16263b` / `#24425e` |
| 文字 / コメント | `#d4e4ec` / `#7f9bb0` |
| キーワード / 関数 / 型 | `#56b6c6` / `#7ee8a8` / `#7cc4f8` |
| 文字列 / 数値 | `#e6d9a2` / `#b9a3f0` |
| プロパティ・引数 | `#9fd9d0` |

## リポジトリの仕組み

`palette.json` がすべての色の元データです。各テーマファイルはここから自動生成されます。

```powershell
node scripts/build.mjs          # vs/Kyokko.vstheme、vscode/themes/、zed/、themes/ を再生成し、コントラストの一覧を表示
node scripts/build.mjs --check  # 生成ファイルが古い場合にエラーにする（CI で実行）
```

生成されたファイルは手で編集しないでください。`palette.json`（または `scripts/build.mjs` 内の割り当て）を変更してから再ビルドします。

### Visual Studio 2026

必要なもの：**Visual Studio 拡張機能の開発** ワークロードを入れた Visual Studio 2026。

1. `Kyokko.slnx` を開いて **F5** を押します。テーマが入った実験用インスタンスの Visual Studio が起動します。
2. 実験用インスタンスで **ツール > テーマ > Kyokko** を選びます。
3. 色をその場で試すには **ツール > オプション > 環境 > 視覚エクスペリエンス > テーマの色** を使い、気に入った値を `scripts/build.mjs` に書き戻します。

`.vstheme` は Visual Studio 2026 の新しいセマンティックトークン（`Shell`、`ShellInternal`）を指定し、指定のない部分は標準のダークテーマにフォールバックします。プロパティ名や引数名などの Roslyn のセマンティックカラーを含むエディターの色は、従来のエディターカテゴリで指定しています。

push のたびに GitHub Actions で VSIX がビルドされます。実行結果の **Artifacts** からダウンロードできます。

Marketplace のページは `vs/marketplace/overview.md`（スクリーンショットは同じフォルダー）で、`vs/publishManifest.json` を使って公開します。

```powershell
& "C:\Program Files\Microsoft Visual Studio\18\Community\VSSDK\VisualStudioIntegration\Tools\Bin\VsixPublisher.exe" publish -payload vs\bin\Release\net48\Kyokko.vsix -publishManifest vs\publishManifest.json -personalAccessToken <token>
```

### VS Code

`vscode/` は VS Code 拡張（`dekunocode.kyokko-theme`）です。`package.json`、Marketplace 用の `README.md`（スクリーンショットは `images/`）、`CHANGELOG.md` に加え、生成ファイルの `themes/kyokko-color-theme.json`、`LICENSE`、`icon.png`（`vs/Resources/Icon.png` のコピー）が入っています。

- 試すには `code --extensionDevelopmentPath=<repo>\vscode` を実行し、**基本設定: 配色テーマ** で **Kyokko** を選びます。
- `.vsix` のビルド（Node.js 18 以上。CI でも push ごとにビルドされます）：

  ```powershell
  cd vscode
  npx @vscode/vsce package   # kyokko-theme-<version>.vsix を出力
  ```

Visual Studio Marketplace（パブリッシャー `dekunocode`）に公開するには、Azure DevOps で個人用アクセストークンを作成し（**User settings > Personal access tokens**、**Organization: All accessible organizations**、**Scopes: Marketplace > Manage**）、次を実行します。

```powershell
cd vscode
npx @vscode/vsce login dekunocode      # トークンを聞かれたら貼り付け
npx @vscode/vsce publish --packagePath kyokko-theme-1.0.0.vsix
```

トークンを使わずに、[marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage/publishers/dekunocode) で `.vsix` をアップロードする方法もあります（**New extension > Visual Studio Code**）。新しいバージョンを出すときは、`vscode/package.json` の `version` を上げ、`CHANGELOG.md` に追記してから再度パッケージします。

### Zed

`zed/` は Zed 拡張（`kyokko-theme`）です。`extension.toml`、ライセンスのコピー（Zed は拡張フォルダー内のライセンスを確認します）、生成ファイルの `themes/kyokko.json` が入っています。

- 試すには **zed: install dev extension** を実行して `zed` フォルダーを選び、テーマピッカーで **Kyokko** を選びます。
- または `zed/themes/kyokko.json` を `%APPDATA%\Zed\themes\` にコピーします。

新しいバージョンを出すときは、`zed/extension.toml` の `version` を上げ、[zed-industries/extensions](https://github.com/zed-industries/extensions) の登録内容（`path = "zed"`）を更新します。

### Windows Terminal

`themes/windows-terminal/kyokko.json` の中身を `settings.json` の `schemes` に貼り付け、`"colorScheme": "Kyokko"` を指定します。

## ライセンス

[MIT](LICENSE.txt)
