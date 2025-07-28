import React, { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaHandsHelping, 
  FaComments, 
  FaClipboardList, 
  FaAddressBook, 
  FaFileAlt, 
  FaSearch, 
  FaStar, 
  FaEnvelope,
  FaChevronRight
} from 'react-icons/fa';

const SubHeader = React.memo(() => {
  const location = useLocation();

  const navigationItems = useMemo(() => [
    { name: '出勤者', href: '/attendance', path: '/attendance', icon: FaUsers, color: 'text-success-400' },
    { name: '福利厚生委員会', href: '/welfare', path: '/welfare', icon: FaHandsHelping, color: 'text-primary-400' },
    { name: '意見箱', href: '/suggestions', path: '/suggestions', icon: FaComments, color: 'text-warning-400' },
    { name: '掲示板', href: '/board', path: '/board', icon: FaClipboardList, color: 'text-secondary-400' },
    { name: '社員名簿', href: '/directory', path: '/directory', icon: FaAddressBook, color: 'text-primary-400' },
    { name: '提出書類', href: '/documents', path: '/documents', icon: FaFileAlt, color: 'text-warning-400' },
    { name: '監査ページ', href: '/audit', path: '/audit', icon: FaSearch, color: 'text-error-400' },
    { name: 'お気に入りに追加', href: '/favorites', path: '/favorites', icon: FaStar, color: 'text-warning-400' },
    { name: 'お問い合わせ', href: '/contact', path: '/contact', icon: FaEnvelope, color: 'text-success-400' }
  ], []);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>ホーム</span>
            {location.pathname !== '/' && (
              <>
                <FaChevronRight className="text-xs" />
                <span className="text-gray-900 font-medium">
                  {navigationItems.find(item => item.path === location.pathname)?.name || 'ページ'}
                </span>
              </>
            )}
          </div>

          {/* Search bar (placeholder) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="検索..."
                className="form-input w-64 text-sm pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="overflow-x-auto scrollbar-thin">
          <div className="flex items-center space-x-1 pb-3 min-w-max">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group relative inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'bg-primary-100 text-primary-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <IconComponent 
                    className={`text-sm transition-colors duration-200 ${
                      active ? 'text-primary-600' : `${item.color} group-hover:text-gray-700`
                    }`}
                  />
                  <span>{item.name}</span>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-600 rounded-full animate-scale-in"></div>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default SubHeader;