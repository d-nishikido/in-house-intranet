import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaPlus, 
  FaMinus, 
  FaSave, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner,
  FaCalculator,
  FaCoffee
} from 'react-icons/fa';

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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:13001/api';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">勤怠報告入力</h1>
                <p className="text-gray-600">日々の勤務時間を記録しましょう</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FaClock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-8 p-4 bg-success-50 border border-success-200 rounded-2xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                  <FaCheckCircle className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <p className="font-medium text-success-800">勤怠報告が正常に送信されました</p>
                  <p className="text-sm text-success-600 mt-1">勤怠報告ページにリダイレクトします...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-error-50 border border-error-200 rounded-2xl">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center mr-3">
                  <FaExclamationTriangle className="w-4 h-4 text-error-600" />
                </div>
                <div>
                  <p className="font-medium text-error-800">エラーが発生しました</p>
                  <p className="text-sm text-error-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <FaCalendarAlt className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">勤怠情報入力</h2>
                  <p className="text-sm text-gray-600">出勤・退勤時間と休憩時間を入力してください</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-primary-600" />
                        日付 <span className="text-error-500 ml-1">*</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div></div>
                </div>
                
                {/* Check-in and Check-out Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-2 text-success-600" />
                        出勤時刻 <span className="text-error-500 ml-1">*</span>
                      </div>
                    </label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-2 text-error-600" />
                        退勤時刻 <span className="text-error-500 ml-1">*</span>
                      </div>
                    </label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={formData.checkOutTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Break Times */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center">
                        <FaCoffee className="w-4 h-4 mr-2 text-warning-600" />
                        休憩時間
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={addBreakTime}
                      className="inline-flex items-center px-4 py-2 bg-success-600 text-white rounded-xl text-sm font-medium hover:bg-success-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <FaPlus className="w-3 h-3 mr-2" />
                      休憩時間を追加
                    </button>
                  </div>
              
                  <div className="space-y-4">
                    {breakTimes.map((breakTime, index) => (
                      <div key={breakTime.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            <FaCoffee className="w-3 h-3 mr-2 text-warning-600" />
                            休憩 {index + 1}
                          </h4>
                          {breakTimes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBreakTime(breakTime.id)}
                              className="p-2 text-error-600 hover:bg-error-100 rounded-lg transition-colors duration-200"
                              title="この休憩時間を削除"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              開始時刻
                            </label>
                            <input
                              type="time"
                              value={breakTime.startTime}
                              onChange={(e) => updateBreakTime(breakTime.id, 'startTime', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              終了時刻
                            </label>
                            <input
                              type="time"
                              value={breakTime.endTime}
                              onChange={(e) => updateBreakTime(breakTime.id, 'endTime', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculated Results */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <FaCalculator className="w-4 h-4 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">計算結果</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">勤務時間</p>
                          <p className="text-2xl font-bold text-gray-900">{calculatedData.workingHours}</p>
                        </div>
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                          <FaClock className="w-5 h-5 text-success-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">残業時間</p>
                          <p className="text-2xl font-bold text-gray-900">{calculatedData.overtimeHours}<span className="text-sm text-gray-500 ml-1">時間</span></p>
                        </div>
                        <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                          <FaClock className="w-5 h-5 text-warning-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    備考
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="特記事項があれば入力してください（遅刻・早退の理由、特別な作業内容など）"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <Link
                    to="/attendance/report"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaTimes className="w-4 h-4 mr-2" />
                    キャンセル
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <FaSave className="w-4 h-4 mr-2" />
                        勤怠報告を送信
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceEntry;