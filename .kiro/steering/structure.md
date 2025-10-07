# プロジェクト構造

## ルートディレクトリ構成

```
in-house-intranet/
├── .claude/                    # Claude Code設定・コマンド
│   └── commands/              # カスタムスラッシュコマンド
│       └── kiro/             # Kiro仕様駆動開発コマンド
├── .kiro/                     # Kiro仕様管理
│   ├── steering/             # ステアリングドキュメント
│   └── specs/                # 機能仕様書
├── backend/                   # バックエンドアプリケーション
├── frontend/                  # フロントエンドアプリケーション
├── e2e-tests/                # E2Eテストスイート
├── database/                  # データベース初期化スクリプト
├── reviews/                   # コードレビュー記録
├── mcp-config/               # MCP (Model Context Protocol) 設定
├── node_modules/             # ルートレベル依存関係
├── docker-compose.yml        # Docker Compose設定
├── .env                      # 環境変数（Git管理外）
├── .env.example              # 環境変数テンプレート
├── package.json              # ルートプロジェクト設定
├── CLAUDE.md                 # Claude Code プロジェクト指示
└── README.md                 # プロジェクトドキュメント
```

## バックエンド構造 (`backend/`)

### ディレクトリ構成
```
backend/
├── src/                      # ソースコード
│   ├── app.js               # アプリケーションエントリーポイント
│   ├── config/              # 設定ファイル
│   │   └── database.js      # データベース接続設定
│   ├── middleware/          # Express ミドルウェア
│   │   ├── auth.js          # JWT認証ミドルウェア
│   │   ├── errorHandler.js  # エラーハンドリング
│   │   ├── security.js      # セキュリティ設定
│   │   └── upload.js        # ファイルアップロード設定
│   ├── models/              # データモデル
│   │   ├── Employee.js      # 従業員モデル
│   │   ├── Announcement.js  # お知らせモデル
│   │   ├── Document.js      # 書類モデル
│   │   └── Organization.js  # 組織モデル
│   ├── routes/              # APIルート定義
│   │   ├── index.js         # ルート集約
│   │   ├── auth.js          # 認証API
│   │   ├── employees.js     # 従業員API
│   │   ├── announcements.js # お知らせAPI
│   │   ├── documents.js     # 書類API
│   │   ├── document-templates.js  # 書類テンプレートAPI
│   │   ├── attendance.js    # 勤怠API
│   │   ├── menu.js          # メニューAPI
│   │   ├── external-links.js # 外部リンクAPI
│   │   └── organizations.js # 組織API
│   └── tests/               # バックエンドテスト
│       ├── auth.test.js     # 認証テスト
│       ├── employees.test.js # 従業員APIテスト
│       └── ...              # 各APIテスト
├── migrations/              # データベースマイグレーション
├── uploads/                 # アップロードファイル保存先
│   └── documents/          # 書類ファイル
├── node_modules/           # バックエンド依存関係
├── Dockerfile              # バックエンドコンテナイメージ
├── package.json            # バックエンド依存関係定義
└── jest.config.js          # Jestテスト設定
```

### コード組織パターン

#### ルート構造 (`routes/`)
```javascript
// routes/[resource].js パターン
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// GET /api/[resource]
router.get('/', authMiddleware, async (req, res) => {
  // コントローラーロジック
});

// POST /api/[resource]
router.post('/', authMiddleware, async (req, res) => {
  // コントローラーロジック
});

module.exports = router;
```

#### モデル構造 (`models/`)
```javascript
// models/[Model].js パターン
const pool = require('../config/database');

class ModelName {
  static async findAll() {
    const result = await pool.query('SELECT * FROM table_name');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM table_name WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    // 作成ロジック
  }

  static async update(id, data) {
    // 更新ロジック
  }

  static async delete(id) {
    // 削除ロジック
  }
}

module.exports = ModelName;
```

#### ミドルウェア構造 (`middleware/`)
```javascript
// middleware/[name].js パターン
module.exports = (req, res, next) => {
  // ミドルウェアロジック
  next();
};
```

## フロントエンド構造 (`frontend/`)

### ディレクトリ構成
```
frontend/
├── src/                     # ソースコード
│   ├── index.js            # アプリケーションエントリーポイント
│   ├── App.jsx             # ルートコンポーネント
│   ├── setupTests.js       # テストセットアップ
│   ├── components/         # 再利用可能なコンポーネント
│   │   ├── layout/        # レイアウトコンポーネント
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── common/        # 汎用コンポーネント
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loading.jsx
│   │   └── features/      # 機能別コンポーネント
│   │       ├── AnnouncementCard.jsx
│   │       ├── DocumentList.jsx
│   │       └── AttendanceForm.jsx
│   ├── pages/              # ページコンポーネント
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── AnnouncementDetail.jsx
│   │   ├── Documents.jsx
│   │   ├── DocumentDetail.jsx
│   │   ├── DocumentForm.jsx
│   │   ├── AttendanceEntry.jsx
│   │   └── AttendanceReport.jsx
│   ├── contexts/           # React Context (状態管理)
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/              # カスタムフック
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useLocalStorage.js
│   ├── services/           # APIサービス層
│   │   ├── api.js         # Axios設定・共通API
│   │   ├── authService.js # 認証API
│   │   ├── announcementService.js
│   │   ├── documentService.js
│   │   └── attendanceService.js
│   ├── utils/              # ユーティリティ関数
│   │   ├── dateFormatter.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/             # グローバルスタイル
│   │   ├── index.css      # Tailwind設定
│   │   └── custom.css     # カスタムスタイル
│   └── tests/              # フロントエンドテスト
│       ├── App.test.js
│       └── components/
├── public/                  # 静的ファイル
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── build/                   # ビルド成果物（Git管理外）
├── node_modules/           # フロントエンド依存関係
├── Dockerfile              # フロントエンドコンテナイメージ
├── package.json            # フロントエンド依存関係定義
└── tailwind.config.js      # Tailwind CSS設定
```

### コード組織パターン

#### ページコンポーネント (`pages/`)
```jsx
// pages/[PageName].jsx パターン
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { serviceMethod } from '../services/[service]';

function PageName() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // データ取得ロジック
  }, []);

  return (
    <Layout>
      {/* ページコンテンツ */}
    </Layout>
  );
}

export default PageName;
```

#### 再利用可能コンポーネント (`components/`)
```jsx
// components/[category]/[ComponentName].jsx パターン
import React from 'react';

function ComponentName({ prop1, prop2, onAction }) {
  return (
    <div className="tailwind-classes">
      {/* コンポーネントUI */}
    </div>
  );
}

export default ComponentName;
```

#### サービス層 (`services/`)
```javascript
// services/[resource]Service.js パターン
import api from './api';

export const getAllResources = async () => {
  const response = await api.get('/resources');
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post('/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  await api.delete(`/resources/${id}`);
};
```

#### カスタムフック (`hooks/`)
```javascript
// hooks/use[HookName].js パターン
import { useState, useEffect } from 'react';

export const useCustomHook = (param) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // 副作用ロジック
  }, [param]);

  return { state, setState };
};
```

## E2Eテスト構造 (`e2e-tests/`)

### ディレクトリ構成
```
e2e-tests/
├── tests/                   # テストケース
│   ├── attendance/         # 勤怠管理テスト
│   │   ├── attendance-entry.test.js
│   │   └── attendance-report.test.js
│   ├── auth/              # 認証テスト
│   │   └── login.test.js
│   ├── home/              # ホームページテスト
│   │   └── home.test.js
│   └── navigation/        # ナビゲーションテスト
│       └── navigation.test.js
├── pages/                  # ページオブジェクト
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── AttendancePage.js
│   └── BasePage.js
├── fixtures/               # テストデータ
│   └── testData.json
├── playwright-report/      # テストレポート（Git管理外）
├── test-results/          # テスト結果（Git管理外）
├── node_modules/          # E2Eテスト依存関係
├── package.json           # E2Eテスト依存関係定義
└── playwright.config.js   # Playwright設定
```

### テストコード組織パターン

#### ページオブジェクトパターン
```javascript
// pages/[Page]Page.js
class PageName {
  constructor(page) {
    this.page = page;
    this.selectors = {
      element: '#element-id',
      button: 'button[type="submit"]',
    };
  }

  async navigate() {
    await this.page.goto('/path');
  }

  async performAction() {
    await this.page.click(this.selectors.button);
  }
}

module.exports = PageName;
```

#### テストケース構造
```javascript
// tests/[feature]/[test].test.js
const { test, expect } = require('@playwright/test');
const PageName = require('../../pages/PageName');

test.describe('機能名', () => {
  test('テストケース説明', async ({ page }) => {
    const pageName = new PageName(page);
    await pageName.navigate();
    // テストアサーション
  });
});
```

## ファイル命名規則

### バックエンド
- **ルート**: `[resource].js` (小文字、ハイフン区切り)
  - 例: `employees.js`, `document-templates.js`
- **モデル**: `[Model].js` (パスカルケース)
  - 例: `Employee.js`, `Announcement.js`
- **ミドルウェア**: `[function].js` (キャメルケース)
  - 例: `auth.js`, `errorHandler.js`
- **テスト**: `[target].test.js`
  - 例: `auth.test.js`, `employees.test.js`

### フロントエンド
- **コンポーネント**: `[ComponentName].jsx` (パスカルケース)
  - 例: `Header.jsx`, `AnnouncementCard.jsx`
- **ページ**: `[PageName].jsx` (パスカルケース)
  - 例: `Home.jsx`, `AttendanceEntry.jsx`
- **サービス**: `[resource]Service.js` (キャメルケース)
  - 例: `authService.js`, `announcementService.js`
- **フック**: `use[HookName].js` (キャメルケース、"use"プレフィックス)
  - 例: `useAuth.js`, `useLocalStorage.js`
- **テスト**: `[target].test.js`
  - 例: `App.test.js`, `Header.test.js`

### E2Eテスト
- **テストファイル**: `[feature].test.js` (ケバブケース)
  - 例: `attendance-entry.test.js`, `login.test.js`
- **ページオブジェクト**: `[Page]Page.js` (パスカルケース、"Page"サフィックス)
  - 例: `LoginPage.js`, `HomePage.js`

## インポート組織

### バックエンド (CommonJS)
```javascript
// 1. Node.js組み込みモジュール
const path = require('path');
const fs = require('fs');

// 2. サードパーティ依存関係
const express = require('express');
const jwt = require('jsonwebtoken');

// 3. プロジェクト内モジュール
const authMiddleware = require('../middleware/auth');
const Employee = require('../models/Employee');

// 4. 設定ファイル
const config = require('../config/database');
```

### フロントエンド (ES Modules)
```javascript
// 1. React関連
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 2. サードパーティライブラリ
import axios from 'axios';
import { FaUser, FaHome } from 'react-icons/fa';

// 3. コンポーネント
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

// 4. フック・サービス・ユーティリティ
import { useAuth } from '../hooks/useAuth';
import { getAllAnnouncements } from '../services/announcementService';
import { formatDate } from '../utils/dateFormatter';

// 5. スタイル
import '../styles/custom.css';
```

## 主要アーキテクチャ原則

### 関心の分離 (Separation of Concerns)
- **バックエンド**: ルート → ミドルウェア → モデル の明確な責務分離
- **フロントエンド**: プレゼンテーション (Components) ↔ ロジック (Services/Hooks) の分離

### 単一責任の原則 (Single Responsibility)
- 各ファイル・クラス・関数は一つの責務のみを持つ
- コンポーネントは UI表示に集中、ビジネスロジックはサービス層へ

### DRY (Don't Repeat Yourself)
- 共通ロジックはユーティリティ関数・カスタムフックに抽出
- 再利用可能なUIはコンポーネント化

### レイヤードアーキテクチャ
```
フロントエンド:
Pages → Components → Hooks/Services → API

バックエンド:
Routes → Middleware → Models → Database
```

### RESTful API設計
```
GET    /api/resources         # 一覧取得
GET    /api/resources/:id     # 詳細取得
POST   /api/resources         # 新規作成
PUT    /api/resources/:id     # 更新
DELETE /api/resources/:id     # 削除
```

### コンポーネント設計パターン
- **コンテナ/プレゼンテーショナル分離**: ページ (ロジック) ↔ コンポーネント (UI)
- **Props駆動**: データはpropsで受け取り、イベントはコールバック
- **Context活用**: グローバル状態は Context API で管理

### テスト戦略
- **単体テスト**: Jest (バックエンドロジック、フロントエンドユーティリティ)
- **コンポーネントテスト**: React Testing Library (UI動作)
- **E2Eテスト**: Playwright (ユーザーシナリオ)
