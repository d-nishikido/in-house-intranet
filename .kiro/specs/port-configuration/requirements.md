# Requirements Document

## Project Description (Input)
データベースポート番号を15433、バックエンドを13001とする

## Introduction
現在の社内イントラネットシステムは、標準的なポート構成（データベース: 5432、バックエンド: 3001）を使用していますが、企業のネットワークポリシーや他システムとのポート競合回避のため、ポート番号の変更が必要となりました。この変更により、システムの運用環境における柔軟性を向上させ、他のサービスとの共存を可能にします。

## Requirements

### Requirement 1: Docker Compose ポート設定の変更
**Objective:** インフラ管理者として、Docker Composeの設定を更新して新しいポート番号を適用したい。これにより、コンテナ環境でのポート競合を回避できる。

#### Acceptance Criteria
1. WHEN システム管理者がdocker-compose.ymlを確認する THEN Docker Composeファイル内のdatabaseサービスのポートマッピングは "15433:5432" と定義されているべきである
2. WHEN システム管理者がdocker-compose.ymlを確認する THEN Docker Composeファイル内のbackendサービスのポートマッピングは "13001:3001" と定義されているべきである
3. WHEN システム管理者がdocker-compose.ymlを確認する THEN frontendサービスのポートマッピングは "3000:3000" のまま変更されていないべきである

### Requirement 2: 環境変数とドキュメントの更新
**Objective:** 開発者として、環境変数テンプレートとドキュメントが新しいポート構成を反映していることを確認したい。これにより、新規参入者が正しい設定で環境をセットアップできる。

#### Acceptance Criteria
1. WHEN 開発者が.env.exampleファイルを確認する THEN ファイルにはDB_PORTのコメントまたは説明として "15433" が記載されているべきである
2. WHEN 開発者がREADME.mdの「ポート構成」セクションを確認する THEN データベースポートは "15433" として記載されているべきである
3. WHEN 開発者がREADME.mdの「ポート構成」セクションを確認する THEN バックエンドAPIポートは "13001" として記載されているべきである
4. WHEN 開発者がREADME.mdの「アクセスURL」セクションを確認する THEN バックエンドAPIのURLは "http://localhost:13001/api" として記載されているべきである
5. WHEN 開発者がREADME.mdの「データベース」セクションを確認する THEN データベース接続先は "localhost:15433" として記載されているべきである

### Requirement 3: バックエンド環境変数設定の更新
**Objective:** バックエンド開発者として、バックエンドアプリケーションが新しいポート番号で起動することを確認したい。これにより、APIサーバーが正しいポートでリッスンする。

#### Acceptance Criteria
1. WHEN 開発者がbackend/.env.exampleを確認する THEN PORT環境変数は "3001" のまま維持されているべきである（コンテナ内部ポート）
2. WHEN 開発者がdocker-compose.ymlのbackendサービス設定を確認する THEN environment設定のPORTは "3001" として定義されているべきである（コンテナ内部ポート）
3. WHEN 開発者がdocker-compose.ymlのbackendサービス設定を確認する THEN portsマッピングは "13001:3001" として定義されているべきである（ホスト:コンテナ）

### Requirement 4: フロントエンド API URL 設定の更新
**Objective:** フロントエンド開発者として、フロントエンドアプリケーションが新しいバックエンドポート経由でAPIにアクセスできることを確認したい。これにより、フロントエンドとバックエンド間の通信が正常に機能する。

#### Acceptance Criteria
1. WHEN 開発者がdocker-compose.ymlのfrontendサービス設定を確認する THEN REACT_APP_API_URL環境変数は "http://localhost:13001/api" として定義されているべきである
2. WHEN 開発者がfrontend/.env.exampleを確認する THEN REACT_APP_API_URL環境変数の例は "http://localhost:13001/api" として記載されているべきである

### Requirement 5: データベース接続設定の更新
**Objective:** バックエンド開発者として、バックエンドアプリケーションが新しいデータベースポート経由で接続できることを確認したい。これにより、データベースとの通信が正常に機能する。

#### Acceptance Criteria
1. WHEN 開発者がdocker-compose.ymlのdatabaseサービス設定を確認する THEN POSTGRES_PORTまたはポートマッピングは "15433:5432" として定義されているべきである
2. WHEN バックエンドがdatabaseサービスに接続する THEN 接続はDocker内部ネットワークを使用し、DB_HOST="database"、DB_PORT="5432"（コンテナ内部ポート）として設定されているべきである
3. WHEN 開発者がホストマシンからデータベースに接続する THEN 接続先は "localhost:15433" として使用されるべきである

### Requirement 6: ステアリングドキュメントの更新
**Objective:** プロジェクト管理者として、ステアリングドキュメント（tech.md）が新しいポート構成を反映していることを確認したい。これにより、AI支援開発時に正しいポート情報が参照される。

#### Acceptance Criteria
1. WHEN 開発者が.kiro/steering/tech.mdの「ポート構成」セクションを確認する THEN データベースポートは "15433" として記載されているべきである
2. WHEN 開発者が.kiro/steering/tech.mdの「ポート構成」セクションを確認する THEN バックエンドポートは "13001" として記載されているべきである
3. WHEN 開発者が.kiro/steering/tech.mdのアーキテクチャ図を確認する THEN 図内のポート表記が新しいポート番号に更新されているべきである
4. WHEN 開発者が.kiro/steering/tech.mdの「環境構築手順」セクションを確認する THEN アクセスURLが新しいポート番号に更新されているべきである

### Requirement 7: E2Eテスト設定の互換性確保
**Objective:** QAエンジニアとして、E2Eテストが新しいポート構成で正常に動作することを確認したい。これにより、テスト環境でのポート設定が正しく反映される。

#### Acceptance Criteria
1. WHEN E2Eテストが実行される THEN テストはフロントエンドに "http://localhost:3000" でアクセスするべきである（フロントエンドポートは変更なし）
2. IF E2Eテスト設定ファイル（playwright.config.js）にバックエンドAPIのベースURLが明示的に設定されている THEN ベースURLは "http://localhost:13001" として更新されているべきである
3. WHEN E2Eテストがバックエンドと通信する THEN テストはフロントエンド経由でプロキシされるか、"http://localhost:13001/api" を使用して直接アクセスするべきである

### Requirement 8: 後方互換性と移行の考慮
**Objective:** システム管理者として、既存の開発環境からスムーズに移行できることを確認したい。これにより、開発者の作業中断を最小限に抑える。

#### Acceptance Criteria
1. WHEN 開発者が既存の.envファイルを使用している THEN docker compose upコマンド実行時に新しいポート設定が適用され、古いポート設定は上書きされるべきである
2. WHEN 開発者がdocker compose downを実行してから新しい設定でdocker compose upを実行する THEN すべてのサービスが新しいポート番号で起動するべきである
3. IF ホストマシンで既にポート15433または13001が使用されている THEN docker compose upは明確なエラーメッセージを表示してポート競合を通知するべきである
