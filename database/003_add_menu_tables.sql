-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  path VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  requires_permission VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_menu_categories_name ON menu_categories(name);
CREATE INDEX idx_menu_categories_order ON menu_categories(order_index);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_path ON menu_items(path);
CREATE INDEX idx_menu_items_order ON menu_items(category_id, order_index);

-- Insert menu categories based on CLAUDE.md specifications
INSERT INTO menu_categories (name, title, icon, order_index) VALUES
  ('company', '会社', 'building', 1),
  ('operations', '業務・ルール', 'clipboard-list', 2),
  ('facilities', '施設', 'map-marker-alt', 3),
  ('management', '管理本部より', 'users-cog', 4),
  ('procedures', '手続き・申請', 'file-alt', 5),
  ('equipment', '機器', 'desktop', 6),
  ('intranet', 'イントラ・メール', 'network-wired', 7);

-- Insert menu items for each category
-- 会社 (Company)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'company'), '会社組織', '/company/organization', '会社の組織構造を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'company'), '「職位制度」について', '/company/position-system', '職位制度の詳細を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'company'), 'COCOスケジュール', '/company/coco-schedule', 'COCOスケジュールを確認できます', 3);

-- 業務・ルール (Operations & Rules)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'operations'), '就業規則', '/operations/work-regulations', '就業規則を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'operations'), '業務ガイドライン', '/operations/guidelines', '業務ガイドラインを確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'operations'), '振替休日', '/operations/substitute-holidays', '振替休日の規定を確認できます', 3);

-- 施設 (Facilities)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'facilities'), '座席・内線', '/facilities/seats-extensions', '座席配置と内線番号を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'facilities'), 'オフィス住所＆外線番号リスト', '/facilities/office-info', 'オフィス情報を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'facilities'), '管理会社連絡先', '/facilities/management-contacts', '管理会社の連絡先を確認できます', 3);

-- 管理本部より (From Management Division)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'management'), '管理本部業務スタッフ', '/management/staff', '管理本部スタッフ情報を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'management'), '人事お知らせ', '/management/hr-announcements', '人事部からのお知らせを確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'management'), '異動情報・Personnel Info.', '/management/personnel-info', '人事異動情報を確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'management'), '総務ページ', '/management/general-affairs', '総務部の情報を確認できます', 4),
  ((SELECT id FROM menu_categories WHERE name = 'management'), '社用車予約', '/management/company-car', '社用車の予約ができます', 5),
  ((SELECT id FROM menu_categories WHERE name = 'management'), 'EiSお知らせ', '/management/eis-announcements', 'EiSからのお知らせを確認できます', 6);

-- 手続き・申請 (Procedures/Applications)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '各種届出申請', '/procedures/various-applications', '各種申請手続きができます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '決裁申請ワークフロー', '/procedures/approval-workflow', '決裁申請の流れを確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '名刺作成依頼', '/procedures/business-card', '名刺の作成を依頼できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '備品購入届', '/procedures/equipment-purchase', '備品購入の申請ができます', 4),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '自動車保険登録', '/procedures/auto-insurance', '自動車保険の登録ができます', 5),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), 'SSL-VPN申請', '/procedures/ssl-vpn', 'SSL-VPNの申請ができます', 6),
  ((SELECT id FROM menu_categories WHERE name = 'procedures'), '社員紹介申請', '/procedures/employee-referral', '社員紹介の申請ができます', 7);

-- 機器 (Equipment)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'equipment'), '電話操作手順', '/equipment/phone-operation', '電話の操作手順を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'equipment'), 'ビデオ会議システム', '/equipment/video-conference', 'ビデオ会議システムの使い方を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'equipment'), 'HDDデータ消去', '/equipment/hdd-data-deletion', 'HDDデータ消去の手順を確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'equipment'), 'PCセットアップ手順', '/equipment/pc-setup', 'PCセットアップの手順を確認できます', 4);

-- イントラ・メール (Intranet & Email)
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), 'イントラ閲覧の設定', '/intranet/settings', 'イントラネットの閲覧設定を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), 'イントラ勤怠操作', '/intranet/attendance-operation', 'イントラネットでの勤怠操作方法を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), 'Office365について', '/intranet/office365', 'Office365の情報を確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), 'メール設定', '/intranet/email-settings', 'メールの設定方法を確認できます', 4),
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), '掲示板利用方法', '/intranet/bulletin-board-usage', '掲示板の利用方法を確認できます', 5),
  ((SELECT id FROM menu_categories WHERE name = 'intranet'), 'ソフトリンク集', '/intranet/software-links', 'ソフトウェアのリンク集を確認できます', 6);