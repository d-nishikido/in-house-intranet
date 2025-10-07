# 技術スタック

## アーキテクチャ概要

**3層アーキテクチャ**: フロントエンド、バックエンド、データベースの明確な分離

```
┌─────────────────────────────────────────┐
│  Frontend (React SPA)                   │
│  Port: 13000                            │
│  - React 18 + React Router v7           │
│  - Tailwind CSS                         │
│  - Axios (HTTP Client)                  │
└────────────┬────────────────────────────┘
             │ REST API
             │ (HTTP/JSON)
┌────────────▼────────────────────────────┐
│  Backend (Express API Server)           │
│  Port: 13001                            │
│  - Node.js + Express                    │
│  - JWT Authentication                   │
│  - Middleware層 (Auth, Security, Upload)│
└────────────┬────────────────────────────┘
             │ pg (PostgreSQL Driver)
             │
┌────────────▼────────────────────────────┐
│  Database (PostgreSQL)                  │
│  Port: 15433                            │
│  - PostgreSQL 15                        │
│  - Docker Volume (永続化)                │
└─────────────────────────────────────────┘
```

**コンテナ化**: Docker Composeによる統合環境管理

## フロントエンド

### コア技術
- **React**: 18.2.0 - UIライブラリ
- **React Router**: 7.0.0 - クライアントサイドルーティング
- **React Scripts**: 5.0.1 - ビルドツール・開発サーバー

### スタイリング
- **Tailwind CSS**: 3.3.0 - ユーティリティファーストCSSフレームワーク
- **PostCSS**: 8.4.24 - CSS処理
- **Autoprefixer**: 10.4.14 - ブラウザベンダープレフィックス自動付与
- **React Icons**: 4.12.0 - アイコンライブラリ

### HTTP通信
- **Axios**: 1.4.0 - HTTPクライアント（Promise ベース）
  - 設定例: `REACT_APP_API_URL=http://localhost:13001/api`

### テスト
- **@testing-library/react**: 13.4.0 - Reactコンポーネントテスト
- **@testing-library/jest-dom**: 5.16.5 - Jest DOM マッチャー
- **@testing-library/user-event**: 13.5.0 - ユーザーイベントシミュレーション
- **web-vitals**: 2.1.4 - パフォーマンス測定

### ビルド設定
```javascript
// Browserslist (package.json)
production: [">0.2%", "not dead", "not op_mini all"]
development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
```

## バックエンド

### コア技術
- **Node.js**: 実行環境
- **Express**: 4.18.2 - Webアプリケーションフレームワーク

### 認証・セキュリティ
- **jsonwebtoken**: 9.0.2 - JWT (JSON Web Token) 認証
- **bcryptjs**: 2.4.3 - パスワードハッシュ化
- **helmet**: 7.0.0 - HTTPヘッダーセキュリティ
- **express-rate-limit**: 6.7.0 - レート制限（DoS/Brute-force攻撃対策）

### データベース
- **pg**: 8.11.0 - PostgreSQL クライアント（Node.js用）

### その他ミドルウェア
- **cors**: 2.8.5 - CORS (Cross-Origin Resource Sharing) 有効化
- **morgan**: 1.10.0 - HTTPリクエストロガー
- **multer**: 2.0.2 - マルチパートフォームデータ処理（ファイルアップロード）

### 環境管理
- **dotenv**: 16.3.1 - 環境変数管理

### 開発ツール
- **nodemon**: 3.0.1 - ファイル変更時の自動再起動

### テスト
- **jest**: 29.5.0 - JavaScriptテストフレームワーク
- **supertest**: 6.3.3 - HTTPアサーションライブラリ

## データベース

### PostgreSQL 15
- **イメージ**: `postgres:15` (公式Dockerイメージ)
- **永続化**: Docker Volume `postgres_data`
- **初期化スクリプト**: `./database/init.sql`
- **ヘルスチェック**: `pg_isready` コマンドによる状態確認

### 接続設定
```
DB_HOST=database (Docker Compose内のサービス名)
DB_PORT=5432
DB_NAME=intranet_db
DB_USER=postgres
DB_PASSWORD=postgres (開発環境のみ)
```

## インフラストラクチャ

### Docker + Docker Compose
- **database**: PostgreSQL 15コンテナ
- **backend**: Express APIサーバーコンテナ
- **frontend**: React開発サーバーコンテナ

### サービス構成
```yaml
services:
  database:
    - ポート: 15433:5432
    - ヘルスチェック: 10秒間隔でpg_isready実行

  backend:
    - ポート: 13001:3001
    - 依存: database (ヘルスチェック成功後に起動)
    - ホットリロード: ./backend ボリュームマウント

  frontend:
    - ポート: 13000:3000
    - 依存: backend
    - ホットリロード: ./frontend ボリュームマウント
```

## E2Eテスト

### Playwright
- **@playwright/test**: 1.40.0 - ブラウザ自動化・E2Eテストフレームワーク
- **mcp-playwright**: 0.0.1 - MCP (Model Context Protocol) Playwright統合

### テスト構成
- **ページオブジェクト**: `e2e-tests/pages/` - 再利用可能なページクラス
- **フィクスチャ**: `e2e-tests/fixtures/` - テストデータ
- **テストスイート**: `e2e-tests/tests/` - 機能別テストケース
  - `attendance/` - 勤怠管理テスト
  - `auth/` - 認証テスト
  - `home/` - ホームページテスト
  - `navigation/` - ナビゲーションテスト

## 開発環境セットアップ

### 必須ツール
- **Docker**: コンテナ実行環境
- **Docker Compose**: マルチコンテナ管理
- **Git**: バージョン管理
- **Node.js** (オプション): ローカル開発時

### 環境構築手順
```bash
# 1. リポジトリクローン
git clone <repository-url>
cd in-house-intranet

# 2. 環境変数設定
cp .env.example .env

# 3. Docker環境起動
docker compose up -d

# 4. アクセス確認
# Frontend: http://localhost:13000
# Backend API: http://localhost:13001
# Database: localhost:15433
```

## 共通開発コマンド

### 全体操作
```bash
npm start           # 全サービス起動 (フォアグラウンド)
npm run dev         # 全サービス起動 (バックグラウンド)
npm run stop        # 全サービス停止
npm run build       # 全サービスビルド
npm run logs        # ログ表示（リアルタイム）
```

### テスト実行
```bash
npm test            # バックエンド + フロントエンド単体テスト
npm run test:backend     # バックエンドテストのみ
npm run test:frontend    # フロントエンドテストのみ
npm run test:e2e         # E2Eテスト実行
npm run test:e2e:ui      # PlaywrightUI モード
npm run test:e2e:headed  # ブラウザ表示モード
npm run test:e2e:debug   # デバッグモード
npm run test:all         # 全テスト実行
```

### バックエンド個別操作
```bash
cd backend
npm run dev         # 開発サーバー起動 (nodemon)
npm start           # プロダクションモード起動
npm test            # Jestテスト実行
npm run migrate     # データベースマイグレーション
```

### フロントエンド個別操作
```bash
cd frontend
npm start           # 開発サーバー起動 (react-scripts)
npm run build       # プロダクションビルド
npm test            # Jestテスト実行
```

## 環境変数

### 共通
- `NODE_ENV`: 実行環境 (`development` | `production`)

### データベース
- `DB_NAME`: データベース名 (デフォルト: `intranet_db`)
- `DB_USER`: データベースユーザー (デフォルト: `postgres`)
- `DB_PASSWORD`: データベースパスワード (デフォルト: `postgres`)
- `DB_HOST`: データベースホスト (Docker内: `database`)
- `DB_PORT`: データベースポート (デフォルト: `5432`)

### バックエンド
- `JWT_SECRET`: JWT署名用シークレットキー (**本番環境では必ず変更**)
- `PORT`: APIサーバーポート (デフォルト: `3001`)

### フロントエンド
- `REACT_APP_API_URL`: バックエンドAPIのURL (デフォルト: `http://localhost:13001/api`)

## ポート構成

| サービス | ポート | 用途 |
|---------|--------|------|
| Frontend | 13000 | React開発サーバー |
| Backend | 13001 | Express APIサーバー |
| Database | 15433 | PostgreSQL |

## セキュリティ考慮事項

### 認証
- JWTトークンによるステートレス認証
- bcryptjsによるパスワードハッシュ化（ソルト付き）

### HTTPセキュリティ
- helmet: セキュリティヘッダー自動設定
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection など

### レート制限
- express-rate-limit: API呼び出し頻度制限
- DoS攻撃・ブルートフォース攻撃対策

### CORS設定
- cors: クロスオリジンリクエストの制御

### ファイルアップロード
- multer: ファイルタイプ・サイズ制限
- アップロード先ディレクトリ: `./backend/uploads/`

## パフォーマンス最適化

### フロントエンド
- React.lazy: コード分割（遅延ロード）
- useMemo/useCallback: 不要な再レンダリング防止
- Tailwind CSS: 未使用CSSの自動削除（PurgeCSS）

### バックエンド
- PostgreSQL接続プーリング
- レスポンスキャッシュ戦略（必要に応じて実装）

### インフラ
- Docker multi-stage builds: イメージサイズ最適化
- ヘルスチェック: サービス起動順序の保証
