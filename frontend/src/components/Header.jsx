import React, { useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaBell, FaClock } from 'react-icons/fa';

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
      return { text: '本日は有休推進日です', isToday: true };
    }
    
    return { 
      text: `定時退社推奨日: ${thirdFriday.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}`,
      isToday: false
    };
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header className="gradient-primary shadow-lg border-b-4 border-primary-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          {/* Left Section - User Info & Date */}
          <div className="flex-1 animate-fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">{displayName}</h1>
                {user?.department && (
                  <p className="text-primary-100 text-sm font-medium">{user.department} • {user.position}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-primary-100">
                <FaClock className="text-xs" />
                <span className="font-medium">今日の日付: {todayDate}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <a 
                  href="/calendar" 
                  className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white hover:text-white backdrop-blur-sm border border-white/20"
                >
                  <FaCalendarAlt className="text-xs" />
                  <span className="font-medium">カレンダー</span>
                </a>
                
                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  paidLeavePromotionDay.isToday 
                    ? 'bg-warning-500 text-white shadow-lg animate-bounce-gentle' 
                    : 'bg-white/10 text-primary-100 backdrop-blur-sm border border-white/20'
                }`}>
                  <FaBell className={`text-xs ${paidLeavePromotionDay.isToday ? 'animate-pulse' : ''}`} />
                  <span>{paidLeavePromotionDay.text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center justify-between lg:justify-end space-x-4">
            {/* Notifications */}
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 focus-visible">
              <FaBell className="text-white text-sm" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile Card */}
            {user && (
              <div className="hidden sm:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                <div className="text-right">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <p className="text-primary-100 text-xs">{user.email}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-error-600 text-white rounded-lg transition-all duration-200 font-medium text-sm backdrop-blur-sm border border-white/20 hover:border-error-500 focus-visible group"
            >
              <FaSignOutAlt className="text-xs group-hover:rotate-12 transition-transform duration-200" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;