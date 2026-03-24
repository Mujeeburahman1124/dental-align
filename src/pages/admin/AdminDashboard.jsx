import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin' };
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0,
    totalHistoricalRevenue: 0,
    activePatients: 0,
    totalAppointments: 0,
    doctorPayouts: 0,
    staffSalaries: 45000,
    netProfit: 0
  });
  const [recentTreatments, setRecentTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [apptsRes, usersRes, treatmentsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config),
            axios.get(`${API_BASE_URL}/api/users`, config),
            axios.get(`${API_BASE_URL}/api/treatments/all`, config)
        ]);

        const allAppts = apptsRes.status === 'fulfilled' ? apptsRes.value.data : apptsRes.data || [];
        const allUsers = usersRes.data || [];
        const allTreatments = treatmentsRes.data || [];

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const todayRevenue = allTreatments
          .filter(t => new Date(t.date).toISOString().split('T')[0] === todayStr)
          .reduce((acc, curr) => acc + (curr.cost || 0), 0);

        const monthRevenue = allTreatments
          .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((acc, curr) => acc + (curr.cost || 0), 0);

        const yearRevenue = allTreatments
          .filter(t => new Date(t.date).getFullYear() === currentYear)
          .reduce((acc, curr) => acc + (curr.cost || 0), 0);

        const totalDoctorPayouts = allTreatments.reduce((acc, curr) => acc + (curr.doctorFee || (curr.cost * 0.40)), 0);
        const monthlyStaffSalary = 45000;

        const currentMonthPayouts = allTreatments
          .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((acc, curr) => acc + (curr.doctorFee || (curr.cost * 0.40)), 0);

        const netProfit = monthRevenue - currentMonthPayouts - monthlyStaffSalary;
        const totalHistoricalRevenue = allTreatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);

        const patientCount = allUsers.filter(u => u.role === 'patient').length;

        setStats({
          todayRevenue,
          monthRevenue,
          yearRevenue,
          totalHistoricalRevenue,
          activePatients: patientCount,
          totalAppointments: allAppts.length,
          doctorPayouts: totalDoctorPayouts,
          staffSalaries: monthlyStaffSalary,
          netProfit
        });

        const sortedTreatments = [...allTreatments].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentTreatments(sortedTreatments.slice(0, 10));
      } catch (error) {
        console.error('Admin Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user.token]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Administration Overview</h1>
            <p className="text-sm font-medium text-slate-500">Practice performance, clinical analysis, and records oversight.</p>
          </div>
          <div className="flex gap-2">
            <button
                onClick={() => navigate('/admin/settings')}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
            >
                System Settings
            </button>
          </div>
        </header>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {[
                { label: "Today Revenue", val: stats.todayRevenue, color: 'text-slate-900', bg: 'bg-white', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
                { label: 'Monthly Yield', val: stats.monthRevenue, color: 'text-blue-600', bg: 'bg-blue-50/30', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg> },
                { label: 'Annual Gross', val: stats.yearRevenue, color: 'text-slate-900', bg: 'bg-white', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
                { label: 'Dr. Payouts', val: stats.doctorPayouts, color: 'text-rose-600', bg: 'bg-rose-50/30', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                { label: 'Operational Costs', val: stats.staffSalaries, color: 'text-amber-600', bg: 'bg-amber-50/30', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> },
                { label: 'Net Practice Profit', val: stats.netProfit, color: 'text-emerald-700', bg: 'bg-emerald-50/50', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg> }
            ].map((stat, i) => (
                <div key={i} className={`${stat.bg} px-4 py-4 rounded border border-slate-200 shadow-sm flex flex-col hover:border-blue-400 transition-all group`}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        <div className="text-slate-400 group-hover:text-blue-500 transition-colors">{stat.icon}</div>
                    </div>
                    <div className={`text-lg font-bold ${stat.color} tracking-tight`}>Rs. {stat.val.toLocaleString()}</div>
                </div>
            ))}
        </div>

        {/* Fast Access Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
                { to: '/admin/users', label: 'User Registry', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                { to: '/admin/staff', label: 'Clinical Staff', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg> },
                { to: '/admin/schedule', label: 'Duty Rosters', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
                { to: '/admin/reports', label: 'Reports Hub', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> },
                { to: '/admin/settings', label: 'System Prefs', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
            ].map((btn, i) => (
                <Link
                    key={i}
                    to={btn.to}
                    className="bg-white p-5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center gap-3 group shadow-sm active:scale-95 text-center min-w-0"
                >
                    <div className="w-10 h-10 rounded border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:text-blue-600 group-hover:bg-white transition-all mb-1 shrink-0">{btn.icon}</div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 truncate w-full">{btn.label}</span>
                </Link>
            ))}
        </div>

        {/* Analytics & Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Procedures</h2>
                        <Link to="/admin/reports" className="text-xs font-bold text-blue-600 hover:underline">View Analytics →</Link>
                    </div>

                    <div className="divide-y divide-slate-100 h-[600px] overflow-y-auto custom-scrollbar">
                        {recentTreatments.length > 0 ? recentTreatments.map(t => (
                            <div key={t._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M5 21h3m-3 0a2 2 0 0 1-2-2v-3"></path></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">{t.patient?.fullName || 'Walk-in'}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-medium">
                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{t.branch?.name || 'Main Branch'}</span>
                                            <span className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">{t.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex sm:flex-col justify-between items-center sm:items-end p-3 sm:p-0 bg-slate-50 sm:bg-transparent rounded-lg">
                                    <p className="text-lg font-bold text-slate-900 tracking-tight">Rs. {t.cost?.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-32 text-center text-slate-300">No recent activity found.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none opacity-80">Historical Gross</p>
                            <h3 className="text-4xl font-bold tracking-tighter">Rs. {stats.totalHistoricalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center border border-white/20 text-white">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
                        </div>
                    </div>
                    <button onClick={() => navigate('/admin/reports')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md">
                        View Reports & Charts
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Practice Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patients</span>
                            <span className="text-sm font-bold text-slate-900">{stats.activePatients}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Appointments</span>
                            <span className="text-sm font-bold text-slate-900">{stats.totalAppointments}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
