import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import './MenuPage.css';

const MenuPage = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, [categoryName]);

  const fetchCategoryData = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:13001/api';
      const response = await fetch(`${apiUrl}/menu/categories/name/${categoryName}/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        setError('カテゴリが見つかりません');
      } else if (!response.ok) {
        throw new Error('Failed to fetch category data');
      } else {
        const data = await response.json();
        if (data.success) {
          setCategoryData(data.data);
        } else {
          setError('データの取得に失敗しました');
        }
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setError('データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-page-loading">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page-error">
        <h2>エラー</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">
          <FaArrowLeft /> ホームに戻る
        </Link>
      </div>
    );
  }

  // If no category data and no error, redirect to home
  if (!categoryData) {
    return <Navigate to="/" replace />;
  }

  const { category, items } = categoryData;

  return (
    <div className="menu-page">
      <div className="menu-page-header">
        <Link to="/" className="back-button">
          <FaArrowLeft /> ホームに戻る
        </Link>
        <h1 className="menu-page-title">{category.title}</h1>
        <p className="menu-page-description">
          {category.title}に関連する項目一覧です。
        </p>
      </div>

      <div className="menu-page-content">
        {items.length === 0 ? (
          <div className="no-items">
            <p>このカテゴリにはまだ項目がありません。</p>
          </div>
        ) : (
          <div className="menu-items-grid">
            {items.map(item => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-card-header">
                  <h3 className="menu-item-title">{item.title}</h3>
                  <FaExternalLinkAlt className="external-link-icon" />
                </div>
                {item.description && (
                  <p className="menu-item-description">{item.description}</p>
                )}
                <div className="menu-item-actions">
                  <Link 
                    to={item.path} 
                    className="menu-item-link"
                    title={`${item.title}に移動`}
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;