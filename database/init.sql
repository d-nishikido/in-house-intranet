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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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