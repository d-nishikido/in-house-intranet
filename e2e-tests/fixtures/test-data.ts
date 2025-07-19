export const testUsers = {
  validUser: {
    email: 'tanaka@company.com',
    password: 'password123',
    name: '田中太郎'
  },
  invalidUser: {
    email: 'invalid@company.com',
    password: 'wrongpassword'
  },
  adminUser: {
    email: 'admin@company.com',
    password: 'admin123',
    name: '管理者'
  }
};

export const testAnnouncements = {
  announcement1: {
    title: 'システムメンテナンスのお知らせ',
    content: '2024年1月15日（月）22:00～翌2:00まで、システムメンテナンスを実施します。',
    date: '2024-01-10'
  },
  announcement2: {
    title: '年末年始の営業について',
    content: '12月29日～1月3日まで休業となります。',
    date: '2024-12-20'
  }
};

export const testExternalLinks = [
  {
    name: 'Health Anshin Connect App',
    url: 'https://app.uconne.jp/'
  },
  {
    name: 'HENNGE One 一時保留確認',
    url: 'https://console.mo.hdems.com/#/eandm.co.jp/'
  },
  {
    name: 'HENNGE One セキュアストレージ',
    url: 'https://transfer.hennge.com/'
  },
  {
    name: 'ANPIC 安否確認システム',
    url: 'https://anpic-v3.jecc.jp/emg/'
  },
  {
    name: 'Office365 Page',
    url: 'https://m365.cloud.microsoft/apps?auth=2'
  }
];

export const testDocuments = {
  pending: {
    applications: 5,
    approvals: 3,
    attendanceReports: 2
  }
};

export const navigationLinks = {
  subHeader: [
    { text: '出席者', href: '/attendees' },
    { text: '福利厚生委員会', href: '/welfare' },
    { text: '目安箱', href: '/suggestions' },
    { text: '掲示板', href: '/bulletin' },
    { text: '社員名簿', href: '/directory' },
    { text: '監査ページ', href: '/audit' },
    { text: 'お気に入りに追加', href: '#' },
    { text: 'お問い合わせ', href: '/contact' }
  ]
};