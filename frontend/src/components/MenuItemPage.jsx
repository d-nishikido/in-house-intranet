import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHammer } from 'react-icons/fa';
import './MenuItemPage.css';

const MenuItemPage = ({ title, categoryName }) => {
  const params = useParams();
  
  // Get the current path segments to build breadcrumbs
  const pathSegments = window.location.pathname.split('/').filter(segment => segment);
  const categorySegment = pathSegments[0];
  const itemSegment = pathSegments[1];

  // Map category names to Japanese titles
  const categoryTitles = {
    company: '会社',
    operations: '業務・ルール',
    facilities: '施設',
    management: '管理本部より',
    procedures: '手続き・申請',
    equipment: '機器',
    intranet: 'イントラ・メール',
    'emg-vision': 'EMGビジョン',
    'business-strategy': '事業戦略会議',
    compliance: 'コンプライアンス委員会',
    development: '開発本部',
    'public-relations': '広報企画部',
    security: '情報セキュリティ',
    recruitment: '社内人材公募',
    education: '教育',
    lists: '一覧',
    reports: '発表・報告'
  };

  // Map item names to Japanese titles
  const itemTitles = {
    // Company
    organization: '会社組織',
    'position-system': '「職位制度」について',
    'coco-schedule': 'COCOスケジュール',
    
    // Operations
    'work-regulations': '就業規則',
    guidelines: '業務ガイドライン',
    'substitute-holidays': '振替休日',
    
    // Facilities
    'seats-extensions': '座席・内線',
    'office-info': 'オフィス住所＆外線番号リスト',
    'management-contacts': '管理会社連絡先',
    
    // Management
    staff: '管理本部業務スタッフ',
    'hr-announcements': '人事お知らせ',
    'personnel-info': '異動情報・Personnel Info.',
    'general-affairs': '総務ページ',
    'company-car': '社用車予約',
    'eis-announcements': 'EiSお知らせ',
    
    // Procedures
    'various-applications': '各種届出申請',
    'approval-workflow': '決裁申請ワークフロー',
    'business-card': '名刺作成依頼',
    'equipment-purchase': '備品購入届',
    'auto-insurance': '自動車保険登録',
    'ssl-vpn': 'SSL-VPN申請',
    'employee-referral': '社員紹介申請',
    
    // Equipment
    'phone-operation': '電話操作手順',
    'video-conference': 'ビデオ会議システム',
    'hdd-data-deletion': 'HDDデータ消去',
    'pc-setup': 'PCセットアップ手順',
    
    // Intranet
    settings: 'イントラ閲覧の設定',
    'attendance-operation': 'イントラ勤怠操作',
    office365: 'Office365について',
    'email-settings': 'メール設定',
    'bulletin-board-usage': '掲示板利用方法',
    'software-links': 'ソフトリンク集',
    
    // EMG Vision
    'corporate-philosophy': '企業理念',
    'management-policy': '経営指針と中期事業計画',
    'environmental-policy': '環境に対する理念と方針',
    
    // Business Strategy
    meeting: '事業戦略会議より',
    'quality-assurance': 'EMG品質保証',
    'budget-planning': '予算計画管理室',
    'civil-law-amendment': '民法の一部改正について',
    'subcontract-act': '下請法について',
    
    // Compliance
    committee: 'コンプライアンス委員会より',
    
    // Development
    'technical-seminar': '技術展開セミナー',
    'dx-task-force': 'DX戦略タスクフォース',
    
    // Public Relations
    portal: '広報企画部ポータルサイト',
    
    // Information Security
    'emg-security': 'EMGセキュリティ',
    'win11-upgrade': 'Win11アップグレード手順書',
    'test-request-2024': 'テスト実施のお願い(2024年)',
    
    // Recruitment
    about: '公募制度について',
    
    // Education
    'training-qualifications': '教育・資格',
    announcements: '教育推進部からのお知らせ',
    'skill-calendar': '業務スキル教育カレンダー',
    'development-plan': '事業内職業能力開発計画',
    
    // Lists
    attendees: '出勤者',
    'employee-count': '社員数',
    'attendance-times': '最早出勤・最遅退勤者一覧',
    'project-numbers': 'プロジェクト番号',
    'partner-attendance': '協力会社メンバの勤務情報',
    
    // Reports
    'emg-topics': 'EMGトピックス',
    'qualification-history': '資格履歴検索',
    'patents-trademarks': '特許と商標登録'
  };

  const currentCategoryTitle = categoryTitles[categorySegment] || categorySegment;
  const currentItemTitle = title || itemTitles[itemSegment] || itemSegment;

  return (
    <div className="menu-item-page">
      <div className="menu-item-header">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">ホーム</Link>
          <span className="breadcrumb-separator">→</span>
          <Link to={`/menu/${categorySegment}`} className="breadcrumb-link">
            {currentCategoryTitle}
          </Link>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-current">{currentItemTitle}</span>
        </div>
        
        <div className="page-header-actions">
          <Link to="/" className="back-button">
            <FaArrowLeft /> ホームに戻る
          </Link>
        </div>
        
        <h1 className="menu-item-title">{currentItemTitle}</h1>
      </div>

      <div className="menu-item-content">
        <div className="under-construction">
          <FaHammer className="construction-icon" />
          <h2>工事中</h2>
          <p>このページは現在準備中です。</p>
          <p>近日中に公開予定です。しばらくお待ちください。</p>
        </div>
      </div>
    </div>
  );
};

export default MenuItemPage;