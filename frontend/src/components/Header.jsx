import React, { useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = React.memo(() => {
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    if (user?.name) {
      return `${user.name}さんのページ`;
    }
    return 'ユーザーのページ';
  }, [user?.name]);

  const todayDate = useMemo(() => {
    return new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }, []);

  const getThirdFriday = useCallback((year, month) => {
    const firstDay = new Date(year, month, 1);
    const firstFriday = new Date(year, month, 1 + (5 - firstDay.getDay() + 7) % 7);
    return new Date(year, month, firstFriday.getDate() + 14);
  }, []);

  const paidLeavePromotionDay = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    
    // 毎月第3金曜日を有休推進日として設定
    const thirdFriday = getThirdFriday(today.getFullYear(), currentMonth);
    
    if (currentDate === thirdFriday.getDate()) {
      return '本日は有休推進日です';
    }
    
    return `定時退社推奨日: ${thirdFriday.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}`;
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-blue-100">今日の日付: {todayDate}</p>
          <p className="text-blue-100 text-sm">
            <a href="/calendar" className="hover:underline mr-4">
              📅 カレンダー
            </a>
            <span className="text-yellow-200">{paidLeavePromotionDay}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-right">
              <p className="text-sm text-blue-100">{user.department}</p>
              <p className="text-sm text-blue-100">{user.position}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;