-- Add new menu categories from Issue #27
INSERT INTO menu_categories (name, title, icon, order_index) VALUES
  ('emg_vision', 'EMGビジョン', 'building', 8),
  ('business_strategy', '事業戦略会議', 'clipboard-list', 9),
  ('compliance', 'コンプライアンス委員会', 'file-alt', 10),
  ('development', '開発本部', 'desktop', 11),
  ('public_relations', '広報企画部', 'users-cog', 12),
  ('information_security', '情報セキュリティ', 'network-wired', 13),
  ('recruitment', '社内人材公募', 'users-cog', 14),
  ('education', '教育', 'clipboard-list', 15),
  ('lists', '一覧', 'clipboard-list', 16),
  ('reports', '発表・報告', 'file-alt', 17)
ON CONFLICT (name) DO NOTHING;

-- Insert menu items for EMGビジョン
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'emg_vision'), '企業理念', '/emg-vision/corporate-philosophy', 'EMGの企業理念を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'emg_vision'), '経営指針と中期事業計画', '/emg-vision/management-policy', '経営指針と中期事業計画を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'emg_vision'), '環境に対する理念と方針', '/emg-vision/environmental-policy', '環境に対する理念と方針を確認できます', 3)
ON CONFLICT DO NOTHING;

-- Insert menu items for 事業戦略会議
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'business_strategy'), '事業戦略会議より', '/business-strategy/meeting', '事業戦略会議の情報を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'business_strategy'), 'EMG品質保証', '/business-strategy/quality-assurance', 'EMG品質保証の情報を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'business_strategy'), '予算計画管理室', '/business-strategy/budget-planning', '予算計画管理室の情報を確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'business_strategy'), '民法の一部改正について', '/business-strategy/civil-law-amendment', '民法の一部改正について確認できます', 4),
  ((SELECT id FROM menu_categories WHERE name = 'business_strategy'), '下請法について', '/business-strategy/subcontract-act', '下請法について確認できます', 5)
ON CONFLICT DO NOTHING;

-- Insert menu items for コンプライアンス委員会
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'compliance'), 'コンプライアンス委員会より', '/compliance/committee', 'コンプライアンス委員会の情報を確認できます', 1)
ON CONFLICT DO NOTHING;

-- Insert menu items for 開発本部
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'development'), '技術展開セミナー', '/development/technical-seminar', '技術展開セミナーの情報を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'development'), 'DX戦略タスクフォース', '/development/dx-task-force', 'DX戦略タスクフォースの情報を確認できます', 2)
ON CONFLICT DO NOTHING;

-- Insert menu items for 広報企画部
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'public_relations'), '広報企画部ポータルサイト', '/public-relations/portal', '広報企画部ポータルサイトを確認できます', 1)
ON CONFLICT DO NOTHING;

-- Insert menu items for 情報セキュリティ
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'information_security'), 'EMGセキュリティ', '/security/emg-security', 'EMGセキュリティの情報を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'information_security'), 'Win11アップグレード手順書', '/security/win11-upgrade', 'Windows 11アップグレード手順書を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'information_security'), 'テスト実施のお願い(2024年)', '/security/test-request-2024', 'テスト実施のお願い(2024年)を確認できます', 3)
ON CONFLICT DO NOTHING;

-- Insert menu items for 社内人材公募
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'recruitment'), '公募制度について', '/recruitment/about', '社内人材公募制度について確認できます', 1)
ON CONFLICT DO NOTHING;

-- Insert menu items for 教育
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'education'), '教育・資格', '/education/training-qualifications', '教育・資格について確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'education'), '教育推進部からのお知らせ', '/education/announcements', '教育推進部からのお知らせを確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'education'), '業務スキル教育カレンダー', '/education/skill-calendar', '業務スキル教育カレンダーを確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'education'), '事業内職業能力開発計画', '/education/development-plan', '事業内職業能力開発計画を確認できます', 4)
ON CONFLICT DO NOTHING;

-- Insert menu items for 一覧
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'lists'), '出勤者', '/lists/attendees', '出勤者一覧を確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'lists'), '社員数', '/lists/employee-count', '社員数を確認できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'lists'), '最早出勤・最遅退勤者一覧', '/lists/attendance-times', '最早出勤・最遅退勤者一覧を確認できます', 3),
  ((SELECT id FROM menu_categories WHERE name = 'lists'), 'プロジェクト番号', '/lists/project-numbers', 'プロジェクト番号一覧を確認できます', 4),
  ((SELECT id FROM menu_categories WHERE name = 'lists'), '協力会社メンバの勤務情報', '/lists/partner-attendance', '協力会社メンバの勤務情報を確認できます', 5)
ON CONFLICT DO NOTHING;

-- Insert menu items for 発表・報告
INSERT INTO menu_items (category_id, title, path, description, order_index) VALUES
  ((SELECT id FROM menu_categories WHERE name = 'reports'), 'EMGトピックス', '/reports/emg-topics', 'EMGトピックスを確認できます', 1),
  ((SELECT id FROM menu_categories WHERE name = 'reports'), '資格履歴検索', '/reports/qualification-history', '資格履歴を検索できます', 2),
  ((SELECT id FROM menu_categories WHERE name = 'reports'), '特許と商標登録', '/reports/patents-trademarks', '特許と商標登録を確認できます', 3)
ON CONFLICT DO NOTHING;