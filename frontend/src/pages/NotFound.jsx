import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">ページが見つかりません</h2>
        <p className="text-gray-600 mb-8">申し訳ございません。お探しのページは存在しません。</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          ホームページに戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFound;