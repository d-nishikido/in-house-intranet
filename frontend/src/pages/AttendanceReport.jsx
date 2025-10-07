import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { 
  FaChartBar, 
  FaCalendarAlt, 
  FaClock, 
  FaCheck, 
  FaHourglass, 
  FaPlus,
  FaSearch,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

const AttendanceReport = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:13001/api';

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
    const statusConfig = {
      pending: {
        color: 'bg-warning-100 text-warning-800 border-warning-200',
        icon: FaHourglass,
        text: '承認待ち'
      },
      approved: {
        color: 'bg-success-100 text-success-800 border-success-200',
        icon: FaCheckCircle,
        text: '承認済み'
      },
      rejected: {
        color: 'bg-error-100 text-error-800 border-error-200',
        icon: FaTimesCircle,
        text: '却下'
      }
    };
    
    const config = statusConfig[status] || {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: FaClock,
      text: status
    };
    
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 group transition-all duration-200"
            >
              <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              ホームに戻る
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">勤怠報告</h1>
                <p className="text-gray-600">勤怠記録の確認と管理</p>
              </div>
              <Link 
                to="/attendance/entry" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                新規勤怠入力
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">出勤日数</div>
                <div className="text-3xl font-bold text-gray-900">{summary.attendance.total_days}<span className="text-lg text-gray-500 ml-1">日</span></div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">承認済み</div>
                <div className="text-3xl font-bold text-gray-900">{summary.attendance.approved_days}<span className="text-lg text-gray-500 ml-1">日</span></div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <FaHourglass className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">承認待ち</div>
                <div className="text-3xl font-bold text-gray-900">{summary.attendance.pending_days}<span className="text-lg text-gray-500 ml-1">日</span></div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-1">残業時間</div>
                <div className="text-3xl font-bold text-gray-900">{summary.attendance.total_overtime || 0}<span className="text-lg text-gray-500 ml-1">時間</span></div>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">開始日</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={() => { fetchAttendanceRecords(); fetchSummary(); }}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSearch className="w-4 h-4 mr-2" />
                検索
              </button>
            </div>
          </div>

          {/* Attendance Records Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <FaChartBar className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">勤怠記録</h2>
                  <p className="text-sm text-gray-600">出勤・退勤記録の詳細一覧</p>
                </div>
              </div>
            </div>
            
            {loading && (
              <div className="flex items-center justify-center p-12">
                <FaSpinner className="animate-spin text-primary-600 text-xl mr-3" />
                <span className="text-gray-600">読み込み中...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <FaTimesCircle className="text-error-600 text-3xl mb-3 mx-auto" />
                  <p className="text-error-600 font-medium">{error}</p>
                </div>
              </div>
            )}
          
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
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-gray-400 text-4xl mb-4 mx-auto" />
                  <p className="text-gray-500 font-medium">指定した期間の勤怠記録がありません</p>
                  <p className="text-gray-400 text-sm mt-2">別の期間を選択してお試しください</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceReport;