import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const DentistDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Dr. Dentist' };
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayCount: 0, totalPatients: 0 });

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  useEffect(() => {
    const fetchDentistData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
        setAppointments(data);

        const today = new Date().toISOString().split('T')[0];
        const todayAppts = data.filter(a => a.date.split('T')[0] === today);

        setStats({
          todayCount: todayAppts.length,
          totalPatients: [...new Set(data.map(a => a.patient?._id))].length
        });

      } catch (error) {
        console.error('Dentist Data Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDentistData();
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
          <div className="text-xs text-gray-400 mt-1 font-medium">Dentist Portal</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem to="/dentist/dashboard" icon="📅" label="My Schedule" active />
          <SidebarItem to="/dentist/records" icon="📋" label="Patient Records" />
          <SidebarItem to="/dentist/prescriptions" icon="💊" label="Prescriptions" />
          <SidebarItem to="/dentist/calendar" icon="🗓️" label="Calendar" />
          <SidebarItem to="/dentist/settings" icon="⚙️" label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dr. {user.fullName?.split(' ').pop()}'s Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your appointments and patient records.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl text-blue-600">📅</div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.todayCount}</div>
              <div className="text-sm font-medium text-gray-500">Appointments Today</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-2xl text-purple-600">👥</div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPatients}</div>
              <div className="text-sm font-medium text-gray-500">Total Patients Seen</div>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading schedule...</div>
            ) : appointments.length > 0 ? appointments.slice(0, 5).map(appt => (
              <div key={appt._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {appt.time.split(' ')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{appt.patient?.fullName || 'Walk-in'}</div>
                    <div className="text-sm text-gray-500">{appt.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/dentist/records', { state: { patientId: appt.patient?._id, startVisit: true } })}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Visit
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-500">
                <span className="block text-4xl mb-2">☕</span>
                No appointments scheduled for today.
              </div>
            )}
          </div>
          {appointments.length > 5 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-sm font-bold text-blue-600 hover:underline">View Full Schedule</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DentistDashboard;
