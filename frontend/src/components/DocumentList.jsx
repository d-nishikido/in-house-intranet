import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import documentService from '../services/documentService';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('このドキュメントを削除してもよろしいですか？')) {
      try {
        await documentService.deleteDocument(id);
        loadDocuments();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'pending':
        return '承認待ち';
      case 'approved':
        return '承認済み';
      case 'rejected':
        return '却下';
      default:
        return status;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-600 py-4">エラー: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">提出書類一覧</h2>
        <Link
          to="/documents/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          新規作成
        </Link>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-3 py-1 rounded ${filter === 'draft' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          下書き
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          承認待ち
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1 rounded ${filter === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          承認済み
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3 py-1 rounded ${filter === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          却下
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => (
            <li key={document.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      <Link to={`/documents/${document.id}`}>
                        {document.title}
                      </Link>
                    </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {getStatusText(document.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <p>
                      タイプ: {document.type} | 作成者: {document.created_by_name} | 
                      作成日: {new Date(document.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/documents/${document.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' ? 'ドキュメントがありません。' : `${getStatusText(filter)}のドキュメントがありません。`}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;