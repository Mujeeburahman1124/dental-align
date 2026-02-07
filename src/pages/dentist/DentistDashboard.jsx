import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const DentistDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Dr. Dentist' };
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayCount: 0, totalPatients: 0 });

  useEffect(() => {
    const fetchDentistData = async () => {
      try {
        let fetchedAppointments = [];
        if (user && user.token) { // Ensure user and token exist before making the call
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config);
          setAppointments(data);
          fetchedAppointments = data;
        }

        const today = new Date().toISOString().split('T')[0];
        const todayAppts = fetchedAppointments.filter(a => a.date.split('T')[0] === today);

        setStats({
          todayCount: todayAppts.length,
          totalPatients: [...new Set(fetchedAppointments.map(a => a.patient?._id))].length
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDentistData();
  }, [user.token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header - Compact */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Dentist Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, Dr. {user.fullName?.split(' ').pop()}</p>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📅</div>
              <div>
                <div className="text-2xl font-black text-gray-900">{stats.todayCount}</div>
                <div className="text-xs font-bold text-gray-500">Today</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">👥</div>
              <div>
                <div className="text-2xl font-black text-gray-900">{stats.totalPatients}</div>
                <div className="text-xs font-bold text-gray-500">Patients</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">✓</div>
              <div>
                <div className="text-2xl font-black text-green-600">Active</div>
                <div className="text-xs font-bold text-gray-500">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Link to="/dentist/records" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-xs font-bold text-gray-900">Treatment Records</div>
          </Link>
          <Link to="/dentist/calendar" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">🗓️</div>
            <div className="text-xs font-bold text-gray-900">Calendar</div>
          </Link>
          <Link to="/dentist/prescriptions" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">💊</div>
            <div className="text-xs font-bold text-gray-900">Prescriptions</div>
          </Link>
          <Link to="/dentist/settings" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-xs font-bold text-gray-900">Settings</div>
          </Link>
        </div>

        {/* Today's Schedule - Compact */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-gray-900">Today's Schedule</h2>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="space-y-3">
            {appointments.length > 0 ? appointments.slice(0, 5).map(appt => (
              <div key={appt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                    {appt.time.split(' ')[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{appt.patient?.fullName || 'Walk-in'}</div>
                    <div className="text-xs text-gray-600 truncate">{appt.reason}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dentist/records', { state: { patientId: appt.patient?._id, startVisit: true } })}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shrink-0 ml-2"
                >
                  Start
                </button>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <span className="block text-3xl mb-2">☕</span>
                <p className="text-sm">No appointments today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentistDashboard;
