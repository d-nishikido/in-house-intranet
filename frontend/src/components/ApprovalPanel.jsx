import React, { useState } from 'react';
import documentService from '../services/documentService';

const ApprovalPanel = ({ documentId, onApproval }) => {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    if (window.confirm('このドキュメントを承認してもよろしいですか？')) {
      setLoading(true);
      setError(null);

      try {
        await documentService.approveDocument(documentId, {
          approver_id: 1, // This should come from auth context
          comments: comments.trim() || null
        });
        
        if (onApproval) {
          onApproval();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('却下理由を入力してください');
      return;
    }

    if (window.confirm('このドキュメントを却下してもよろしいですか？')) {
      setLoading(true);
      setError(null);

      try {
        await documentService.rejectDocument(documentId, {
          rejector_id: 1, // This should come from auth context
          comments: comments.trim()
        });
        
        if (onApproval) {
          onApproval();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          コメント
        </label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          placeholder="承認・却下理由やコメントを入力してください（却下の場合は必須）"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '処理中...' : '承認'}
        </button>
        
        <button
          onClick={handleReject}
          disabled={loading}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '処理中...' : '却下'}
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>※ 承認・却下操作は取り消すことができません。</p>
        <p>※ 却下の場合は理由の入力が必要です。</p>
      </div>
    </div>
  );
};

export default ApprovalPanel;