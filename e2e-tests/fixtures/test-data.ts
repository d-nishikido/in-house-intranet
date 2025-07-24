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

export const testAttendanceData = {
  summary: {
    totalDays: 8,
    approvedDays: 6,
    pendingDays: 2,
    totalOvertime: 2.50
  },
  records: [
    {
      id: 1,
      date: '2025-07-24',
      checkInTime: '09:00',
      checkOutTime: null,
      breakStartTime: null,
      breakEndTime: null,
      overtimeHours: 0.00,
      status: 'pending',
      notes: '勤務中'
    },
    {
      id: 2,
      date: '2025-07-23',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: '通常勤務'
    },
    {
      id: 3,
      date: '2025-07-22',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: '通常勤務'
    },
    {
      id: 4,
      date: '2025-07-21',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: '通常勤務'
    },
    {
      id: 5,
      date: '2025-07-20',
      checkInTime: '09:05',
      checkOutTime: '18:15',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: null
    },
    {
      id: 6,
      date: '2025-07-19',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: null
    },
    {
      id: 7,
      date: '2025-07-03',
      checkInTime: '08:45',
      checkOutTime: '19:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 2.00,
      status: 'pending',
      notes: '残業あり'
    },
    {
      id: 8,
      date: '2025-07-02',
      checkInTime: '09:15',
      checkOutTime: '18:30',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.50,
      status: 'approved',
      notes: '少し遅刻'
    },
    {
      id: 9,
      date: '2025-07-01',
      checkInTime: '09:00',
      checkOutTime: '18:00',
      breakStartTime: '12:00',
      breakEndTime: '13:00',
      overtimeHours: 0.00,
      status: 'approved',
      notes: '通常勤務'
    }
  ],
  dateFilters: {
    currentMonth: {
      startDate: '2025-07-01',
      endDate: '2025-07-31'
    },
    customRange: {
      startDate: '2025-07-01',
      endDate: '2025-07-03'
    },
    emptyRange: {
      startDate: '2025-01-01',
      endDate: '2025-01-02'
    }
  },
  expectedCalculations: {
    standardWorkDay: {
      checkIn: '09:00',
      checkOut: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      expectedWorkingHours: '8:00'
    },
    overtimeDay: {
      checkIn: '08:45',
      checkOut: '19:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      expectedWorkingHours: '9:15',
      expectedOvertime: 2.00
    }
  }
};

export const testLeaveData = {
  summary: {
    pendingLeaveRequests: 1
  },
  requests: [
    {
      id: 1,
      employeeId: 1,
      startDate: '2025-08-01',
      endDate: '2025-08-03',
      leaveType: 'annual_leave',
      reason: '夏期休暇',
      status: 'pending'
    }
  ]
};