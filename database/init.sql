-- Create database schema for in-house intranet system

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    organization_id INTEGER REFERENCES organizations(id),
    position VARCHAR(100),
    extension VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    content TEXT,
    created_by INTEGER REFERENCES employees(id),
    approved_by INTEGER REFERENCES employees(id),
    rejected_by INTEGER REFERENCES employees(id),
    submitted_at TIMESTAMP,
    department_id INTEGER REFERENCES organizations(id),
    due_date DATE,
    file_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External links table
CREATE TABLE IF NOT EXISTS external_links (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document files table
CREATE TABLE IF NOT EXISTS document_files (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document approvals table
CREATE TABLE IF NOT EXISTS document_approvals (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    approver_id INTEGER REFERENCES employees(id),
    status VARCHAR(20) NOT NULL, -- approved, rejected, pending
    comments TEXT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document templates table
CREATE TABLE IF NOT EXISTS document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    template_data JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO organizations (name) VALUES 
('管理本部'),
('開発本部'),
('営業本部'),
('総務部'),
('人事部');

-- Default password for all test users is 'password123'
-- Hash generated using bcrypt with salt rounds 10
INSERT INTO employees (name, email, password_hash, department, organization_id, position, extension) VALUES 
('田中太郎', 'tanaka@company.com', '$2b$10$J7cXbgkNYOdWHCkXF3XmY.KZrVjIeJGfHbmRuNZWKjsRGWZhbmGg6', 'IT部', 2, 'マネージャー', '1001'),
('佐藤花子', 'sato@company.com', '$2b$10$J7cXbgkNYOdWHCkXF3XmY.KZrVjIeJGfHbmRuNZWKjsRGWZhbmGg6', '人事部', 5, 'スタッフ', '1002'),
('山田次郎', 'yamada@company.com', '$2b$10$J7cXbgkNYOdWHCkXF3XmY.KZrVjIeJGfHbmRuNZWKjsRGWZhbmGg6', '総務部', 4, 'チーフ', '1003');

INSERT INTO announcements (title, content, created_by) VALUES 
('システムメンテナンスのお知らせ', '来週月曜日にシステムメンテナンスを実施します。', 1),
('新年度研修について', '4月から新年度研修を開始します。詳細は後日連絡します。', 2),
('健康診断の実施', '年次健康診断を来月実施予定です。', 2);

INSERT INTO documents (title, type, status, content, created_by) VALUES 
('勤務届', 'attendance', 'pending', '3月分の勤務届です。', 1),
('PC持出申請', 'device', 'approved', 'ノートPC持出申請書', 1),
('有給申請', 'leave', 'pending', '有給休暇申請書', 3),
('経費精算', 'expense', 'pending', '出張費精算書', 2);

INSERT INTO external_links (name, url, description, category) VALUES 
('健康あんしんコネクト', 'https://app.uconne.jp/', '健康管理アプリ', 'health'),
('HENNGE One 一時預かり確認', 'https://console.mo.hdems.com/#/eandm.co.jp/', 'セキュアファイル管理', 'security'),
('HENNGE One セキュアストレージ', 'https://transfer.hennge.com/', 'ファイル転送サービス', 'security'),
('ANPIC 安否確認システム', 'https://anpic-v3.jecc.jp/emg/', '緊急時安否確認', 'emergency'),
('Office365 ページ', 'https://m365.cloud.microsoft/apps?auth=2', 'Microsoft 365 アプリ', 'office');

-- Sample document templates
INSERT INTO document_templates (name, type, template_data, is_active) VALUES 
('勤務届テンプレート', 'attendance_report', '{"fields": [{"name": "勤務日", "type": "date", "required": true}, {"name": "開始時間", "type": "time", "required": true}, {"name": "終了時間", "type": "time", "required": true}, {"name": "休憩時間", "type": "number", "required": true}]}', true),
('PC持出申請テンプレート', 'device_application', '{"fields": [{"name": "機器名", "type": "text", "required": true}, {"name": "持出期間", "type": "daterange", "required": true}, {"name": "目的", "type": "textarea", "required": true}, {"name": "持出先", "type": "text", "required": true}]}', true),
('キャリア面談シートテンプレート', 'career_review', '{"fields": [{"name": "面談日", "type": "date", "required": true}, {"name": "自己評価", "type": "rating", "required": true}, {"name": "目標設定", "type": "textarea", "required": true}, {"name": "課題", "type": "textarea", "required": false}]}', true);