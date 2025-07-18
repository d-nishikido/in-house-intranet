import React from 'react';
import Header from './Header';
import SubHeader from './SubHeader';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SubHeader />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;