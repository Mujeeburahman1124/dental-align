import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Using existing endpoints to simulate admin data
        const { data: allAppts } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
        const { data: allPatients } = await axios.get('http://localhost:5000/api/users/patients', config);

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
        console.error('Admin Data Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user.token]);

  const SidebarItem = ({ to, icon, label, active = false }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-2xl">🦷</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">DentAlign</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 font-medium">Clinic Administration</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem to="/admin/dashboard" icon="📊" label="Dashboard" active />
          <SidebarItem to="/admin/reports" icon="📈" label="Reports & Analytics" />
          <SidebarItem to="/admin/balance" icon="💰" label="Financial Overview" />
          {/* Placeholder for future multi-clinic features */}
          {/* <SidebarItem to="/admin/users" icon="👥" label="User Management" /> */}
          {/* <SidebarItem to="/admin/settings" icon="⚙️" label="Settings" /> */}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              {user.fullName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinic Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, get a quick update on your clinic's performance.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
              Export Data
            </button>
            <Link to="/admin/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2">
              View Full Reports
            </Link>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Today\'s Revenue', val: `Rs. ${stats.todayRevenue.toLocaleString()}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Patients', val: stats.activePatients, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Appointments', val: stats.totalAppointments, icon: '📅', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Occupancy Rate', val: stats.occupancyRate, icon: '⚡', color: 'text-orange-600', bg: 'bg-orange-50' }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center text-xl`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-bold ${s.color} bg-opacity-10 px-2 py-1 rounded-full`}>
                  +2.5%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{s.val}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                <Link to="/admin/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentAppts.length > 0 ? recentAppts.map(appt => (
                  <div key={appt._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">🦷</div>
                      <div>
                        <div className="font-semibold text-gray-900">{appt.patient?.fullName || 'Walk-in Patient'}</div>
                        <div className="text-xs text-gray-500">{appt.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{appt.time}</div>
                      <div className="text-xs text-gray-500">{new Date(appt.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-500 text-sm">No recent activity found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/reports" className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group">
                  <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100">📈</span>
                  <span className="text-sm font-semibold text-gray-700">View Financial Report</span>
                </Link>
                <Link to="/admin/balance" className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group">
                  <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100">💰</span>
                  <span className="text-sm font-semibold text-gray-700">Check Balance</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group text-left">
                  <span className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100">👨‍⚕️</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-700 block">Manage Staff</span>
                    <span className="text-[10px] text-gray-400">Coming Soon</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
