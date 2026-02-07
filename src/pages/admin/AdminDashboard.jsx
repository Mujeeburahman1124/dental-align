import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin User' };
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    activePatients: 0,
    totalAppointments: 0,
    occupancyRate: '0%'
  });
  const [recentAppts, setRecentAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: allAppts } = await axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config);
        const { data: allPatients } = await axios.get(`${API_BASE_URL}/api/users/patients`, config);

        const today = new Date().toISOString().split('T')[0];
        const todayAppts = allAppts.filter(a => a.date.split('T')[0] === today);

        setStats({
          todayRevenue: todayAppts.length * 2500,
          activePatients: allPatients.length,
          totalAppointments: allAppts.length,
          occupancyRate: '82%'
        });

        setRecentAppts(allAppts.slice(0, 5));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
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
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Clinic performance overview</p>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">💰</div>
            </div>
            <div className="text-xl md:text-2xl font-black text-gray-900">Rs. {stats.todayRevenue.toLocaleString()}</div>
            <div className="text-xs font-bold text-gray-500">Today's Revenue</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">👥</div>
            </div>
            <div className="text-xl md:text-2xl font-black text-gray-900">{stats.activePatients}</div>
            <div className="text-xs font-bold text-gray-500">Active Patients</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-lg">📅</div>
            </div>
            <div className="text-xl md:text-2xl font-black text-gray-900">{stats.totalAppointments}</div>
            <div className="text-xs font-bold text-gray-500">Appointments</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-lg">⚡</div>
            </div>
            <div className="text-xl md:text-2xl font-black text-gray-900">{stats.occupancyRate}</div>
            <div className="text-xs font-bold text-gray-500">Occupancy</div>
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Link to="/admin/reports" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-xs font-bold text-gray-900">Reports</div>
          </Link>
          <Link to="/admin/balance" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-xs font-bold text-gray-900">Balance</div>
          </Link>
          <Link to="/admin/users" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <div className="text-xs font-bold text-gray-900">Staff</div>
          </Link>
          <Link to="/admin/settings" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-xs font-bold text-gray-900">Settings</div>
          </Link>
        </div>

        {/* Recent Appointments - Compact */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-gray-900">Recent Appointments</h2>
            <Link to="/admin/reports" className="text-xs font-bold text-blue-600">View All</Link>
          </div>
          <div className="space-y-2">
            {recentAppts.length > 0 ? recentAppts.map(appt => (
              <div key={appt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg shrink-0">🦷</div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{appt.patient?.fullName || 'Walk-in'}</div>
                    <div className="text-xs text-gray-600 truncate">{appt.reason}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-bold text-gray-900">{appt.time}</div>
                  <div className="text-xs text-gray-500">{new Date(appt.date).toLocaleDateString()}</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <span className="block text-3xl mb-2">📊</span>
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
