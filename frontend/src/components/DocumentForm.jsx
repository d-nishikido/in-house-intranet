import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import documentService from '../services/documentService';
import FileUploader from './FileUploader';

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    department_id: '',
    due_date: '',
    created_by: 1 // This should come from auth context
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);

  const documentTypes = [
    { value: 'attendance_report', label: '勤務届' },
    { value: 'approval_route', label: '承認ルート図' },
    { value: 'device_application', label: 'PC/機器持出申請' },
    { value: 'career_review', label: 'キャリア面談シート' },
    { value: 'self_assessment', label: '自己評価シート' },
    { value: 'contract_info', label: '契約・業務委託情報' },
    { value: 'extension_registration', label: '内線登録' },
    { value: 'pc_ledger', label: 'PC管理台帳' },
    { value: 'career_info', label: 'キャリア情報' },
  ];

  useEffect(() => {
    if (isEdit) {
      loadDocument();
    }
  }, [id, isEdit]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocument(id);
      setDocument(data);
      setFormData({
        title: data.title || '',
        type: data.type || '',
        content: data.content || '',
        department_id: data.department_id || '',
        due_date: data.due_date ? data.due_date.split('T')[0] : '',
        created_by: data.created_by
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await documentService.updateDocument(id, formData);
      } else {
        await documentService.createDocument(formData);
      }
      navigate('/documents');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDocument = async () => {
    if (window.confirm('このドキュメントを提出してもよろしいですか？提出後は編集できません。')) {
      try {
        await documentService.submitDocument(id);
        navigate('/documents');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading && isEdit) return <div className="text-center py-4">読み込み中...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEdit ? 'ドキュメント編集' : '新規ドキュメント作成'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            ドキュメントタイプ *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">選択してください</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            内容
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            期限日
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? '保存中...' : (isEdit ? '更新' : '作成')}
          </button>
          
          {isEdit && document?.status === 'draft' && (
            <button
              type="button"
              onClick={handleSubmitDocument}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              提出
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            キャンセル
          </button>
        </div>
      </form>

      {isEdit && document && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">ファイル</h3>
          <FileUploader documentId={id} document={document} onUpload={loadDocument} />
        </div>
      )}
    </div>
  );
};

export default DocumentForm;