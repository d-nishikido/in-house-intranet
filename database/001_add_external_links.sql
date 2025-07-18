-- Add external_links table for managing external system links
CREATE TABLE IF NOT EXISTS external_links (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add sample data for existing external links
INSERT INTO external_links (name, url, description, category) VALUES 
('健康安心コネクトアプリ', 'https://app.uconne.jp/', '健康管理アプリケーション', 'health'),
('HENNGE One - 送信一時保留確認', 'https://console.mo.hdems.com/#/eandm.co.jp/', 'メール送信一時保留の確認', 'email'),
('HENNGE One - セキュアストレージ', 'https://transfer.hennge.com/', 'セキュアファイル転送サービス', 'security'),
('ANPIC - 安否確認システム', 'https://anpic-v3.jecc.jp/emg/', '緊急時安否確認システム', 'emergency'),
('Office365のページ', 'https://m365.cloud.microsoft/apps?auth=2', 'Microsoft 365 アプリケーション', 'office');