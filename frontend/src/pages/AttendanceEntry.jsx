import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const AttendanceEntry = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    checkInTime: '',
    checkOutTime: '',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    notes: ''
  });

  const [calculatedData, setCalculatedData] = useState({
    workingHours: '0:00',
    overtimeHours: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    calculateWorkingHours();
  }, [formData.checkInTime, formData.checkOutTime, formData.breakStartTime, formData.breakEndTime]);

  const calculateWorkingHours = () => {
    const { checkInTime, checkOutTime, breakStartTime, breakEndTime } = formData;
    
    if (!checkInTime || !checkOutTime) {
      setCalculatedData({ workingHours: '0:00', overtimeHours: 0 });
      return;
    }

    const checkIn = new Date(`2000-01-01T${checkInTime}`);
    const checkOut = new Date(`2000-01-01T${checkOutTime}`);
    const breakStart = breakStartTime ? new Date(`2000-01-01T${breakStartTime}`) : null;
    const breakEnd = breakEndTime ? new Date(`2000-01-01T${breakEndTime}`) : null;

    let totalMinutes = (checkOut - checkIn) / (1000 * 60);
    
    if (breakStart && breakEnd) {
      const breakMinutes = (breakEnd - breakStart) / (1000 * 60);
      totalMinutes -= breakMinutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const workingHours = `${hours}:${minutes.toString().padStart(2, '0')}`;
    
    // Calculate overtime (assuming 8 hours is standard work day)
    const standardWorkMinutes = 8 * 60; // 8 hours
    const overtimeMinutes = Math.max(0, totalMinutes - standardWorkMinutes);
    const overtimeHours = overtimeMinutes / 60;

    setCalculatedData({
      workingHours,
      overtimeHours: parseFloat(overtimeHours.toFixed(2))
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.date) {
      setError('日付を入力してください');
      return false;
    }
    if (!formData.checkInTime) {
      setError('出勤時刻を入力してください');
      return false;
    }
    if (!formData.checkOutTime) {
      setError('退勤時刻を入力してください');
      return false;
    }
    
    const checkIn = new Date(`2000-01-01T${formData.checkInTime}`);
    const checkOut = new Date(`2000-01-01T${formData.checkOutTime}`);
    
    if (checkOut <= checkIn) {
      setError('退勤時刻は出勤時刻より後の時間を入力してください');
      return false;
    }

    if (formData.breakStartTime && formData.breakEndTime) {
      const breakStart = new Date(`2000-01-01T${formData.breakStartTime}`);
      const breakEnd = new Date(`2000-01-01T${formData.breakEndTime}`);
      
      if (breakEnd <= breakStart) {
        setError('休憩終了時刻は休憩開始時刻より後の時間を入力してください');
        return false;
      }
      
      if (breakStart < checkIn || breakEnd > checkOut) {
        setError('休憩時間は勤務時間内に設定してください');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        employee_id: user.id,
        date: formData.date,
        check_in_time: formData.checkInTime,
        check_out_time: formData.checkOutTime,
        break_start_time: formData.breakStartTime || null,
        break_end_time: formData.breakEndTime || null,
        overtime_hours: calculatedData.overtimeHours,
        notes: formData.notes || null
      };

      await axios.post(
        `${API_URL}/attendance/records`,
        requestData,
        { headers: authService.getAuthHeader() }
      );

      setSuccess(true);
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutTime: '',
        breakStartTime: '12:00',
        breakEndTime: '13:00',
        notes: ''
      });

      // Redirect to report page after 2 seconds
      setTimeout(() => {
        navigate('/attendance/report');
      }, 2000);

    } catch (err) {
      console.error('Error submitting attendance:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('勤怠報告の送信に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← ホームに戻る
          </Link>
          <h1 className="text-2xl font-bold mb-4">勤怠報告入力</h1>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>成功!</strong> 勤怠報告が正常に送信されました。勤怠報告ページにリダイレクトします...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>エラー:</strong> {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出勤時刻 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Check-out Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                退勤時刻 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Break Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  休憩開始時刻
                </label>
                <input
                  type="time"
                  name="breakStartTime"
                  value={formData.breakStartTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  休憩終了時刻
                </label>
                <input
                  type="time"
                  name="breakEndTime"
                  value={formData.breakEndTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Calculated Working Hours */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">計算結果</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">勤務時間:</span>
                  <span className="ml-2 font-semibold">{calculatedData.workingHours}</span>
                </div>
                <div>
                  <span className="text-gray-600">残業時間:</span>
                  <span className="ml-2 font-semibold">{calculatedData.overtimeHours}時間</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="特記事項があれば入力してください"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between">
              <Link
                to="/attendance/report"
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? '送信中...' : '勤怠報告を送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceEntry;