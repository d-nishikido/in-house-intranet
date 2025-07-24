import React, { useState } from 'react';
import Header from './Header';
import SubHeader from './SubHeader';
import Menu from './Menu';
import { FaBars } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SubHeader />
      
      {/* Menu Toggle Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2 py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
            aria-label="メニューを開く"
          >
            <FaBars />
            <span className="font-medium">メニュー</span>
          </button>
        </div>
      </div>

      {/* Menu Component */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;