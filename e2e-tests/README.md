# E2E Testing Guide

## 概要

このディレクトリには、社内イントラネットシステムのEnd-to-End（E2E）テストが含まれています。PlaywrightとMCPサーバーを使用して実装されています。

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Docker と Docker Compose（開発環境）

### インストール

1. 依存関係のインストール
```bash
npm install
```

2. Playwrightブラウザのインストール
```bash
npm run playwright:install
```

## テスト実行

### 基本コマンド

```bash
# 全E2Eテストを実行
npm run test:e2e

# ヘッドモードでテスト実行（ブラウザを表示）
npm run test:e2e:headed

# UIモードでテスト実行（対話的）
npm run test:e2e:ui

# デバッグモード
npm run test:e2e:debug

# 単体・E2E両方のテストを実行
npm run test:all
```

### 特定のテストの実行

```bash
# ログインテストのみ実行
npx playwright test auth/login.spec.ts

# ホームページテストのみ実行
npx playwright test home/home.spec.ts

# ナビゲーションテストのみ実行
npx playwright test navigation/navigation.spec.ts
```

### ブラウザ指定

```bash
# Chromeのみ
npx playwright test --project=chromium

# Firefoxのみ
npx playwright test --project=firefox

# WebKitのみ
npx playwright test --project=webkit
```

## ディレクトリ構造

```
e2e-tests/
├── tests/                  # テストファイル
│   ├── auth/               # 認証関連テスト
│   │   └── login.spec.ts
│   ├── home/               # ホームページテスト
│   │   └── home.spec.ts
│   └── navigation/         # ナビゲーションテスト
│       └── navigation.spec.ts
├── pages/                  # Page Object Model
│   ├── login.page.ts
│   └── home.page.ts
├── fixtures/               # テストデータ
│   └── test-data.ts
├── playwright.config.ts    # Playwright設定
└── README.md              # このファイル
```

## Page Object Model

テストコードの再利用性と保守性を高めるため、Page Object Modelパターンを採用しています。

### LoginPage

```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@example.com', 'password');
```

### HomePage

```typescript
const homePage = new HomePage(page);
const announcements = await homePage.getAnnouncementTitles();
const links = await homePage.getExternalLinks();
```

## テストデータ

`fixtures/test-data.ts`にテスト用のデータを定義しています。

```typescript
import { testUsers } from '../fixtures/test-data';

// 有効なユーザーでログイン
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
```

## MCP (Model Context Protocol) 設定

MCPサーバーの設定は`../mcp-config/playwright-mcp.json`で管理されています。

### 主な設定項目

- **baseURL**: テスト対象のアプリケーションURL
- **timeout**: テストタイムアウト
- **retries**: リトライ回数
- **workers**: 並列実行数

## 環境設定

### 開発環境

テストを実行する前に、開発環境を起動してください：

```bash
# Docker環境を起動
npm run dev

# または手動でフロントエンド・バックエンドを起動
cd frontend && npm start &
cd backend && npm run dev
```

### CI/CD環境

CI環境では以下の設定が適用されます：

- `forbidOnly: true` - test.onlyの使用を禁止
- `retries: 2` - 失敗時のリトライ
- `workers: 1` - シーケンシャル実行
- ヘッドレスモード

## トラブルシューティング

### よくある問題

1. **タイムアウトエラー**
   - アプリケーションの起動を確認
   - `webServer.timeout`を増加

2. **要素が見つからない**
   - セレクターの確認
   - 待機時間の調整

3. **フレーキーテスト**
   - 適切な待機処理の追加
   - `page.waitForLoadState()`の使用

### デバッグ

```bash
# スクリーンショット付きで実行
npx playwright test --screenshot=on

# 詳細ログ出力
DEBUG=pw:api npx playwright test

# 特定のテストをデバッグモードで実行
npx playwright test auth/login.spec.ts --debug
```

## レポート

テスト実行後、以下の場所にレポートが生成されます：

- HTML レポート: `test-results/`
- JSON レポート: `test-results/results.json`
- JUnit レポート: `test-results/junit.xml`

```bash
# HTMLレポートを表示
npx playwright show-report
```

## 新しいテストの追加

1. 適切なディレクトリに`.spec.ts`ファイルを作成
2. 必要に応じてPage Objectを作成
3. テストデータを`fixtures/test-data.ts`に追加
4. テストを実行して動作確認

## ベストプラクティス

- Page Object Modelを使用して再利用性を高める
- テストデータは外部ファイルで管理
- 適切な待機処理を実装
- テストの独立性を保つ
- わかりやすいテスト名とコメントを記述
- 外部システムへの依存を最小化

## 関連ドキュメント

- [Playwright Documentation](https://playwright.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [プロジェクトREADME](../README.md)