import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:13001'}/api/announcements/${id}`
        );
        setAnnouncement(response.data);
      } catch (err) {
        setError('お知らせの取得に失敗しました');
        console.error('Error fetching announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← ホームに戻る
        </Link>
        
        {loading && <p>読み込み中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!loading && !error && announcement && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">{announcement.title}</h1>
            <p className="text-gray-500 mb-4">
              投稿日: {new Date(announcement.created_at).toLocaleDateString('ja-JP')}
            </p>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{announcement.content}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnnouncementDetail;