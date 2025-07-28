import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Login Card */}
        <div className="card shadow-2xl">
          {/* Header */}
          <div className="card-header text-center bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FaUser className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">社内イントラネット</h1>
            <p className="text-primary-100 text-sm">従業員専用ログイン</p>
          </div>

          {/* Form */}
          <div className="card-body space-y-6">
            {error && (
              <div className="flex items-center p-4 bg-error-50 border border-error-200 rounded-lg animate-slide-down">
                <FaExclamationCircle className="text-error-600 mr-3 flex-shrink-0" />
                <span className="text-error-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="form-label flex items-center">
                  <FaUser className="text-gray-400 mr-2 text-sm" />
                  メールアドレス
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input pl-10"
                    placeholder="your.email@company.com"
                    autoComplete="email"
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="form-label flex items-center">
                  <FaLock className="text-gray-400 mr-2 text-sm" />
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input pl-10"
                    placeholder="パスワードを入力してください"
                    autoComplete="current-password"
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary btn-lg justify-center group relative overflow-hidden"
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      ログイン中...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                      ログイン
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="card-footer text-center">
            <div className="text-xs text-gray-500">
              <p>© 2025 社内イントラネットシステム</p>
              <p className="mt-1">セキュリティ保護されたログイン</p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>ログインでお困りの場合は、</p>
          <p>
            システム管理者まで
            <a href="mailto:admin@company.com" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              お問い合わせください
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;