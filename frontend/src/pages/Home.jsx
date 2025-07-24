import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  FaBullhorn, 
  FaExternalLinkAlt, 
  FaFileAlt, 
  FaClock, 
  FaChartBar,
  FaArrowRight,
  FaCalendarCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrendingUp
} from 'react-icons/fa';

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
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="card-hover">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  社内イントラネット ダッシュボード
                </h1>
                <p className="text-gray-600">
                  本日もお疲れ様です。今日のタスクとお知らせをご確認ください。
                </p>
              </div>
              <div className="hidden md:block">
                <FaChartBar className="text-4xl text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Announcements Card */}
            <div className="card-hover animate-fade-in">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaBullhorn className="text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">お知らせ</h2>
                      <p className="text-sm text-gray-500">重要な情報をお知らせします</p>
                    </div>
                  </div>
                  <Link 
                    to="/announcements" 
                    className="btn-secondary btn-sm"
                  >
                    すべて見る
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-primary-600 text-xl mr-3" />
                    <span className="text-gray-600">読み込み中...</span>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center p-4 bg-error-50 border border-error-200 rounded-lg">
                    <FaExclamationTriangle className="text-error-600 mr-3" />
                    <span className="text-error-700">{error}</span>
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="space-y-4">
                    {announcements.map((announcement, index) => (
                      <div key={announcement.id} className={`animate-slide-up opacity-0 animate-delay-${index * 100}`} style={{animationDelay: `${index * 100}ms`, animationFillMode: 'forwards'}}>
                        <Link 
                          to={`/announcements/${announcement.id}`} 
                          className="block p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-100 hover:border-primary-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                                {announcement.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {announcement.content}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>
                                  {new Date(announcement.created_at).toLocaleDateString('ja-JP')}
                                </span>
                                {announcement.priority && (
                                  <span className={`badge ${
                                    announcement.priority === 'high' ? 'badge-error' :
                                    announcement.priority === 'medium' ? 'badge-warning' :
                                    'badge-secondary'
                                  }`}>
                                    {announcement.priority === 'high' ? '重要' :
                                     announcement.priority === 'medium' ? '通常' : '参考'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <FaArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors duration-200 ml-4 mt-1" />
                          </div>
                        </Link>
                      </div>
                    ))}
                    
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={!pagination.hasPreviousPage}
                          className="btn-secondary btn-sm"
                        >
                          前へ
                        </button>
                        <span className="text-sm text-gray-600">
                          {pagination.currentPage} / {pagination.totalPages} ページ
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                          disabled={!pagination.hasNextPage}
                          className="btn-secondary btn-sm"
                        >
                          次へ
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* External Links Card */}
            <div className="card-hover animate-fade-in">
              <div className="card-header">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                    <FaExternalLinkAlt className="text-success-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">外部システムリンク</h2>
                    <p className="text-sm text-gray-500">よく使用する外部システムへのクイックアクセス</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {linksLoading && (
                  <div className="flex items-center justify-center py-4">
                    <FaSpinner className="animate-spin text-primary-600 mr-2" />
                    <span className="text-gray-600">読み込み中...</span>
                  </div>
                )}
                
                {linksError && (
                  <div className="flex items-center p-3 bg-error-50 border border-error-200 rounded-lg">
                    <FaExclamationTriangle className="text-error-600 mr-2" />
                    <span className="text-error-700 text-sm">{linksError}</span>
                  </div>
                )}
                
                {!linksLoading && !linksError && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {externalLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-300"
                        title={link.description}
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 group-hover:text-primary-700">
                            {link.name}
                          </span>
                          {link.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {link.description}
                            </p>
                          )}
                        </div>
                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-600 text-sm ml-2" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Document Status Card */}
            <div className="card-hover animate-fade-in">
              <div className="card-header">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-warning-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">書類処理状況</h3>
                    <p className="text-xs text-gray-500">進行中のタスク</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {documentsLoading && (
                  <div className="flex items-center justify-center py-4">
                    <FaSpinner className="animate-spin text-primary-600 mr-2" />
                    <span className="text-gray-600 text-sm">読み込み中...</span>
                  </div>
                )}
                
                {documentsError && (
                  <div className="flex items-center p-2 bg-error-50 border border-error-200 rounded text-xs">
                    <FaExclamationTriangle className="text-error-600 mr-1" />
                    <span className="text-error-700">{documentsError}</span>
                  </div>
                )}
                
                {!documentsLoading && !documentsError && (
                  <div className="space-y-3">
                    {documentCounts.map((item) => {
                      const getStatusConfig = (status) => {
                        switch (status) {
                          case 'pending':
                            return { 
                              label: '申請中', 
                              icon: FaClock, 
                              bgClass: 'bg-warning-50 border-warning-200', 
                              textClass: 'text-warning-800',
                              countClass: 'bg-warning-100 text-warning-800'
                            };
                          case 'approved':
                            return { 
                              label: '承認済み', 
                              icon: FaCheckCircle, 
                              bgClass: 'bg-success-50 border-success-200', 
                              textClass: 'text-success-800',
                              countClass: 'bg-success-100 text-success-800'
                            };
                          case 'rejected':
                            return { 
                              label: '却下', 
                              icon: FaTimesCircle, 
                              bgClass: 'bg-error-50 border-error-200', 
                              textClass: 'text-error-800',
                              countClass: 'bg-error-100 text-error-800'
                            };
                          default:
                            return { 
                              label: '下書き', 
                              icon: FaEdit, 
                              bgClass: 'bg-gray-50 border-gray-200', 
                              textClass: 'text-gray-800',
                              countClass: 'bg-gray-100 text-gray-800'
                            };
                        }
                      };
                      
                      const config = getStatusConfig(item.status);
                      const IconComponent = config.icon;
                      
                      return (
                        <div key={item.status} className={`flex items-center justify-between p-3 border rounded-lg ${config.bgClass}`}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`text-sm ${config.textClass}`} />
                            <span className={`text-sm font-medium ${config.textClass}`}>
                              {config.label}
                            </span>
                          </div>
                          <span className={`badge ${config.countClass} font-semibold`}>
                            {item.count}件
                          </span>
                        </div>
                      );
                    })}
                    
                    <div className="pt-3 border-t border-gray-100">
                      <Link 
                        to="/documents" 
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium group"
                      >
                        <span>書類一覧を見る</span>
                        <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Work Status Card */}
            <div className="card-hover animate-fade-in">
              <div className="card-header">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FaCalendarCheck className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">勤務状況</h3>
                    <p className="text-xs text-gray-500">勤怠管理</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <Link 
                    to="/attendance/entry" 
                    className="group flex items-center p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-300"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <FaEdit className="text-primary-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 group-hover:text-primary-700">
                        勤怠報告入力
                      </span>
                      <p className="text-xs text-gray-500">今日の勤務時間を記録</p>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                  
                  <Link 
                    to="/attendance/report" 
                    className="group flex items-center p-3 bg-gray-50 hover:bg-success-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-success-300"
                  >
                    <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                      <FaTrendingUp className="text-success-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 group-hover:text-success-700">
                        勤怠報告ページ
                      </span>
                      <p className="text-xs text-gray-500">月次レポートの確認</p>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-success-600 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                  
                  <Link 
                    to="/attendance/schedule" 
                    className="group flex items-center p-3 bg-gray-50 hover:bg-warning-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-warning-300"
                  >
                    <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mr-3">
                      <FaCalendarCheck className="text-warning-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 group-hover:text-warning-700">
                        勤務予定設定
                      </span>
                      <p className="text-xs text-gray-500">スケジュールの管理</p>
                    </div>
                    <FaArrowRight className="text-gray-400 group-hover:text-warning-600 group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;