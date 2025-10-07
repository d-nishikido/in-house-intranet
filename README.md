# In-House Intranet System

社内イントラネットシステムの基盤実装

## 技術スタック

- **Frontend**: React 18 + React Router v6 + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 15
- **Container**: Docker + Docker Compose

## 開発環境セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd in-house-intranet
```

2. 環境変数ファイルの設定
```bash
cp .env.example .env
```

3. Docker環境の起動
```bash
docker compose up -d
```

4. アプリケーションにアクセス
- Frontend: http://localhost:13000
- Backend API: http://localhost:13001
- Database: localhost:15433

## 開発コマンド

### 全体
```bash
# 全サービス起動
docker compose up

# 全サービス停止
docker compose down

# ログ確認
docker compose logs -f
```

### Backend
```bash
# 開発サーバー起動
cd backend
npm run dev

# テスト実行
npm test
```

### Frontend
```bash
# 開発サーバー起動
cd frontend
npm start

# ビルド
npm run build

# テスト実行
npm test
```

## プロジェクト構成

```
in-house-intranet/
├── docker-compose.yml
├── .env
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── migrations/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── public/
└── database/
    └── init.sql
```

## 実装済み機能

### Phase 1: プロジェクト基盤構築
- [x] Docker環境セットアップ
- [x] Node.js + Express バックエンドの基本構造
- [x] PostgreSQL データベースセットアップ
- [x] React Router v6 フロントエンドの基本構造
- [x] 基本的なプロジェクト構成とbuild設定

### 基本機能
- [x] ホームページ（お知らせ一覧、外部システムリンク、書類処理状況）
- [x] ログインページ（UI のみ）
- [x] 404ページ
- [x] PostgreSQL データベース接続
- [x] REST API エンドポイント（従業員、お知らせ、書類、組織）

## 今後の実装予定

- 認証・認可システム
- より詳細なUI/UXの実装
- ファイルアップロード機能
- 通知システム
- 各種申請・承認ワークフロー

## サンプルアカウント
- メール: tanaka@company.com, sato@company.com, yamada@company.com
- パスワード: password123