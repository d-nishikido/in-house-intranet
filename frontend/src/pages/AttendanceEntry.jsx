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
    notes: ''
  });

  const [breakTimes, setBreakTimes] = useState([
    { id: 1, startTime: '12:00', endTime: '13:00' }
  ]);

  const [calculatedData, setCalculatedData] = useState({
    workingHours: '0:00',
    overtimeHours: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    calculateWorkingHours();
  }, [formData.checkInTime, formData.checkOutTime, breakTimes]);

  const addBreakTime = () => {
    const newId = Math.max(...breakTimes.map(b => b.id), 0) + 1;
    setBreakTimes([...breakTimes, { id: newId, startTime: '', endTime: '' }]);
  };

  const removeBreakTime = (id) => {
    if (breakTimes.length > 1) {
      setBreakTimes(breakTimes.filter(b => b.id !== id));
    }
  };

  const updateBreakTime = (id, field, value) => {
    setBreakTimes(breakTimes.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const calculateWorkingHours = () => {
    const { checkInTime, checkOutTime } = formData;
    
    if (!checkInTime || !checkOutTime) {
      setCalculatedData({ workingHours: '0:00', overtimeHours: 0 });
      return;
    }

    const checkIn = new Date(`2000-01-01T${checkInTime}`);
    const checkOut = new Date(`2000-01-01T${checkOutTime}`);

    let totalMinutes = (checkOut - checkIn) / (1000 * 60);
    
    // Calculate total break time
    let totalBreakMinutes = 0;
    breakTimes.forEach(breakTime => {
      if (breakTime.startTime && breakTime.endTime) {
        const breakStart = new Date(`2000-01-01T${breakTime.startTime}`);
        const breakEnd = new Date(`2000-01-01T${breakTime.endTime}`);
        const breakMinutes = (breakEnd - breakStart) / (1000 * 60);
        if (breakMinutes > 0) {
          totalBreakMinutes += breakMinutes;
        }
      }
    });

    totalMinutes -= totalBreakMinutes;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
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

    // Validate break times
    for (let i = 0; i < breakTimes.length; i++) {
      const breakTime = breakTimes[i];
      if (breakTime.startTime && breakTime.endTime) {
        const breakStart = new Date(`2000-01-01T${breakTime.startTime}`);
        const breakEnd = new Date(`2000-01-01T${breakTime.endTime}`);
        
        if (breakEnd <= breakStart) {
          setError(`休憩${i + 1}: 終了時刻は開始時刻より後の時間を入力してください`);
          return false;
        }
        
        if (breakStart < checkIn || breakEnd > checkOut) {
          setError(`休憩${i + 1}: 休憩時間は勤務時間内に設定してください`);
          return false;
        }
      } else if (breakTime.startTime || breakTime.endTime) {
        setError(`休憩${i + 1}: 開始時刻と終了時刻の両方を入力してください`);
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
        break_times: breakTimes.filter(bt => bt.startTime && bt.endTime),
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
        notes: ''
      });
      setBreakTimes([
        { id: 1, startTime: '12:00', endTime: '13:00' }
      ]);

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
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  休憩時間
                </label>
                <button
                  type="button"
                  onClick={addBreakTime}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                >
                  + 休憩時間を追加
                </button>
              </div>
              
              {breakTimes.map((breakTime, index) => (
                <div key={breakTime.id} className="grid grid-cols-2 gap-4 mb-3 p-3 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      休憩{index + 1} 開始時刻
                    </label>
                    <input
                      type="time"
                      value={breakTime.startTime}
                      onChange={(e) => updateBreakTime(breakTime.id, 'startTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      休憩{index + 1} 終了時刻
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={breakTime.endTime}
                        onChange={(e) => updateBreakTime(breakTime.id, 'endTime', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {breakTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBreakTime(breakTime.id)}
                          className="bg-red-600 text-white px-2 py-2 rounded text-sm hover:bg-red-700 transition duration-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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