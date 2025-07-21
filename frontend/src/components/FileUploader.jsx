import React, { useState } from 'react';
import documentService from '../services/documentService';

const FileUploader = ({ documentId, document, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await documentService.uploadFiles(documentId, files);
      setFiles([]);
      if (onUpload) {
        onUpload();
      }
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const blob = await documentService.downloadFile(documentId, fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('このファイルを削除してもよろしいですか？')) {
      try {
        await documentService.deleteFile(documentId, fileId);
        if (onUpload) {
          onUpload();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label htmlFor="files" className="block text-sm font-medium text-gray-700">
            ファイル添付
          </label>
          <input
            type="file"
            id="files"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            PDF, DOC, DOCX, XLS, XLSX, JPG, PNG ファイル（最大10MB）
          </p>
        </div>

        {files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">選択されたファイル:</h4>
            <ul className="mt-2 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name} ({formatFileSize(file.size)})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </form>

      {document?.files && document.files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">添付ファイル:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {document.files.map((file) => (
                <li key={file.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{file.file_name}</span>
                    <span className="text-xs text-gray-400">({formatFileSize(file.file_size)})</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file.id, file.file_name)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ダウンロード
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;