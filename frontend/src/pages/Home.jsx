import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [externalLinks, setExternalLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState(null);
  const [documentCounts, setDocumentCounts] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/announcements`,
          { params: { page: currentPage, limit: 5 } }
        );
        setAnnouncements(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        setError('お知らせの取得に失敗しました');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentPage]);

  useEffect(() => {
    const fetchExternalLinks = async () => {
      try {
        setLinksLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/external-links`
        );
        setExternalLinks(response.data);
      } catch (err) {
        setLinksError('外部システムリンクの取得に失敗しました');
        console.error('Error fetching external links:', err);
      } finally {
        setLinksLoading(false);
      }
    };

    fetchExternalLinks();
  }, []);

  useEffect(() => {
    const fetchDocumentCounts = async () => {
      try {
        setDocumentsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/documents/status-count`
        );
        setDocumentCounts(response.data);
      } catch (err) {
        setDocumentsError('書類処理状況の取得に失敗しました');
        console.error('Error fetching document counts:', err);
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocumentCounts();
  }, []);

  return (
    <Layout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">お知らせ</h2>
            {loading && <p>読み込み中...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <>
                <ul className="space-y-2">
                  {announcements.map((announcement) => (
                    <li key={announcement.id} className="border-b pb-2">
                      <Link to={`/announcements/${announcement.id}`} className="block hover:bg-gray-50 p-2 rounded">
                        <h3 className="font-semibold text-blue-600 hover:underline">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(announcement.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPreviousPage}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      前へ
                    </button>
                    <span className="text-sm">
                      {pagination.currentPage} / {pagination.totalPages} ページ
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                      次へ
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">外部システムリンク</h2>
            {linksLoading && <p>読み込み中...</p>}
            {linksError && <p className="text-red-500">{linksError}</p>}
            {!linksLoading && !linksError && (
              <ul className="space-y-2">
                {externalLinks.map((link) => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      title={link.description}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">書類の処理状況</h2>
            {documentsLoading && <p>読み込み中...</p>}
            {documentsError && <p className="text-red-500">{documentsError}</p>}
            {!documentsLoading && !documentsError && (
              <>
                <ul className="space-y-2">
                  {documentCounts.map((item) => (
                    <li key={item.status} className="flex justify-between">
                      <span>
                        {item.status === 'pending' && '申請'}
                        {item.status === 'approved' && '承認済み'}
                        {item.status === 'rejected' && '却下'}
                        {item.status === 'draft' && '下書き'}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.count}件
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/documents" className="text-blue-600 hover:underline flex items-center">
                    書類一覧を見る
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">勤務状況</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/attendance/report" className="text-blue-600 hover:underline">
                  勤怠報告ページ
                </Link>
              </li>
              <li>
                <Link to="/attendance/schedule" className="text-blue-600 hover:underline">
                  勤務予定設定ページ
                </Link>
              </li>
            </ul>
          </div>
        </div>
    </Layout>
  );
};

export default Home;