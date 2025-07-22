import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import documentService from '../services/documentService';
import FileUploader from './FileUploader';
import ApprovalPanel from './ApprovalPanel';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocument(id);
      setDocument(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このドキュメントを削除してもよろしいですか？')) {
      try {
        await documentService.deleteDocument(id);
        navigate('/documents');
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

  const getTypeText = (type) => {
    const types = {
      'attendance_report': '勤務届',
      'approval_route': '承認ルート図',
      'device_application': 'PC/機器持出申請',
      'career_review': 'キャリア面談シート',
      'self_assessment': '自己評価シート',
      'contract_info': '契約・業務委託情報',
      'extension_registration': '内線登録',
      'pc_ledger': 'PC管理台帳',
      'career_info': 'キャリア情報',
    };
    return types[type] || type;
  };

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-600 py-4">エラー: {error}</div>;
  if (!document) return <div className="text-gray-600 py-4">ドキュメントが見つかりません</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {document.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {getTypeText(document.type)}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
              {getStatusText(document.status)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">作成者</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.created_by_name}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(document.created_at).toLocaleString('ja-JP')}
              </dd>
            </div>
            
            {document.submitted_at && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">提出日</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(document.submitted_at).toLocaleString('ja-JP')}
                </dd>
              </div>
            )}
            
            {document.due_date && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">期限日</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(document.due_date).toLocaleDateString('ja-JP')}
                </dd>
              </div>
            )}
            
            {document.approved_by_name && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">承認者</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {document.approved_by_name}
                </dd>
              </div>
            )}
            
            {document.rejected_by_name && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">却下者</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {document.rejected_by_name}
                </dd>
              </div>
            )}
            
            {document.content && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">内容</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="whitespace-pre-wrap">{document.content}</div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link
          to="/documents"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          一覧に戻る
        </Link>
        
        {(document.status === 'draft' || document.status === 'rejected') && (
          <Link
            to={`/documents/${id}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            編集
          </Link>
        )}
        
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          削除
        </button>
      </div>

      {/* File Uploader */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">ファイル</h3>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <FileUploader documentId={id} document={document} onUpload={loadDocument} />
        </div>
      </div>

      {/* Approval Panel */}
      {document.status === 'pending' && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">承認操作</h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <ApprovalPanel documentId={id} onApproval={loadDocument} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetail;