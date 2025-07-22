import React, { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const SubHeader = React.memo(() => {
  const location = useLocation();

  const navigationItems = useMemo(() => [
    { name: '出勤者', href: '/attendance', path: '/attendance' },
    { name: '福利厚生委員会', href: '/welfare', path: '/welfare' },
    { name: '意見箱', href: '/suggestions', path: '/suggestions' },
    { name: '掲示板', href: '/board', path: '/board' },
    { name: '社員名簿', href: '/directory', path: '/directory' },
    { name: '提出書類', href: '/documents', path: '/documents' },
    { name: '監査ページ', href: '/audit', path: '/audit' },
    { name: 'お気に入りに追加', href: '/favorites', path: '/favorites' },
    { name: 'お問い合わせ', href: '/contact', path: '/contact' }
  ], []);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  return (
    <nav className="bg-blue-500 text-white p-2">
      <div className="container mx-auto">
        <ul className="flex flex-wrap gap-4 text-sm">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`hover:underline transition-colors ${
                  isActive(item.path) 
                    ? 'text-yellow-200 font-semibold' 
                    : 'text-white'
                }`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
});

export default SubHeader;