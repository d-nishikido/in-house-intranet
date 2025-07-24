import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const AttendanceReport = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    // Set default dates (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (user && startDate && endDate) {
      fetchAttendanceRecords();
      fetchSummary();
    }
  }, [user, startDate, endDate]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/records/${user.id}`,
        { 
          params: { startDate, endDate },
          headers: authService.getAuthHeader()
        }
      );
      setAttendanceRecords(response.data);
    } catch (err) {
      setError('勤怠記録の取得に失敗しました');
      console.error('Error fetching attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/attendance/summary/${user.id}`,
        { headers: authService.getAuthHeader() }
      );
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching attendance summary:', err);
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5); // HH:MM format
  };

  const formatBreakTimes = (breakTimes, legacyBreakStart, legacyBreakEnd) => {
    if (breakTimes && breakTimes.length > 0) {
      // Use new break_times data
      return breakTimes.map((breakTime, index) => (
        <div key={index} className="text-xs">
          {formatTime(breakTime.start_time)} - {formatTime(breakTime.end_time)}
        </div>
      ));
    } else if (legacyBreakStart && legacyBreakEnd) {
      // Fallback to legacy break time for old records
      return (
        <div className="text-xs">
          {formatTime(legacyBreakStart)} - {formatTime(legacyBreakEnd)}
        </div>
      );
    }
    return '-';
  };

  const calculateWorkingHours = (checkIn, checkOut, breakTimes, legacyBreakStart, legacyBreakEnd) => {
    if (!checkIn || !checkOut) return '-';
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    
    let totalMinutes = (checkOutTime - checkInTime) / (1000 * 60);
    
    // Calculate total break time from multiple break periods
    if (breakTimes && breakTimes.length > 0) {
      // Use new break_times data
      breakTimes.forEach(breakTime => {
        if (breakTime.start_time && breakTime.end_time) {
          const breakStart = new Date(`2000-01-01T${breakTime.start_time}`);
          const breakEnd = new Date(`2000-01-01T${breakTime.end_time}`);
          const breakMinutes = (breakEnd - breakStart) / (1000 * 60);
          if (breakMinutes > 0) {
            totalMinutes -= breakMinutes;
          }
        }
      });
    } else if (legacyBreakStart && legacyBreakEnd) {
      // Fallback to legacy break time for old records
      const breakStartTime = new Date(`2000-01-01T${legacyBreakStart}`);
      const breakEndTime = new Date(`2000-01-01T${legacyBreakEnd}`);
      const breakMinutes = (breakEndTime - breakStartTime) / (1000 * 60);
      totalMinutes -= breakMinutes;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: '承認待ち',
      approved: '承認済み',
      rejected: '却下'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← ホームに戻る
          </Link>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">勤怠報告</h1>
            <Link 
              to="/attendance/entry" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              新規勤怠入力
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">出勤日数</div>
              <div className="text-2xl font-bold text-blue-600">{summary.attendance.total_days}日</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">承認済み</div>
              <div className="text-2xl font-bold text-green-600">{summary.attendance.approved_days}日</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">承認待ち</div>
              <div className="text-2xl font-bold text-yellow-600">{summary.attendance.pending_days}日</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">残業時間</div>
              <div className="text-2xl font-bold text-purple-600">{summary.attendance.total_overtime || 0}時間</div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
              onClick={() => { fetchAttendanceRecords(); fetchSummary(); }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              検索
            </button>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">勤怠記録</h2>
          </div>
          
          {loading && <div className="p-6">読み込み中...</div>}
          {error && <div className="p-6 text-red-500">{error}</div>}
          
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出勤時刻</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">退勤時刻</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">休憩時間</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">勤務時間</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">残業時間</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.check_in_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(record.check_out_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatBreakTimes(record.break_times, record.break_start_time, record.break_end_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateWorkingHours(record.check_in_time, record.check_out_time, record.break_times, record.break_start_time, record.break_end_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.overtime_hours || 0}時間
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {attendanceRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  指定した期間の勤怠記録がありません
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceReport;