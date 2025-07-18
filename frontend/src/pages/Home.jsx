import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/announcements`);
        setAnnouncements(response.data);
      } catch (err) {
        setError('お知らせの取得に失敗しました');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">田中太郎さんのページ</h1>
          <p className="text-blue-100">今日の日付: {new Date().toLocaleDateString('ja-JP')}</p>
        </div>
      </header>

      <nav className="bg-blue-500 text-white p-2">
        <div className="container mx-auto">
          <ul className="flex flex-wrap gap-4 text-sm">
            <li><a href="#" className="hover:underline">出勤者</a></li>
            <li><a href="#" className="hover:underline">福利厚生委員会</a></li>
            <li><a href="#" className="hover:underline">意見箱</a></li>
            <li><a href="#" className="hover:underline">掲示板</a></li>
            <li><a href="#" className="hover:underline">社員名簿</a></li>
            <li><a href="#" className="hover:underline">監査ページ</a></li>
            <li><a href="#" className="hover:underline">お気に入りに追加</a></li>
            <li><a href="#" className="hover:underline">お問い合わせ</a></li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">お知らせ</h2>
            {loading && <p>読み込み中...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <ul className="space-y-2">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="border-b pb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-gray-600">{announcement.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">外部システムリンク</h2>
            <ul className="space-y-2">
              <li>
                <a href="https://app.uconne.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  健康安心コネクトアプリ
                </a>
              </li>
              <li>
                <a href="https://console.mo.hdems.com/#/eandm.co.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  HENNGE One - 送信一時保留確認
                </a>
              </li>
              <li>
                <a href="https://transfer.hennge.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  HENNGE One - セキュアストレージ
                </a>
              </li>
              <li>
                <a href="https://anpic-v3.jecc.jp/emg/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ANPIC - 安否確認システム
                </a>
              </li>
              <li>
                <a href="https://m365.cloud.microsoft/apps?auth=2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Office365のページ
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">書類の処理状況</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>申請</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">2件</span>
              </li>
              <li className="flex justify-between">
                <span>決裁（勤務届以外）</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">1件</span>
              </li>
              <li className="flex justify-between">
                <span>決裁（勤務届）</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">1件</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;