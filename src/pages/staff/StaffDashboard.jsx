import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffDashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ todayCount: 0, pendingConfirmation: 0, totalPatients: 0, todayRevenue: 0, monthRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [resAppt, resPatients, resTreatments] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config),
                axios.get(`${API_BASE_URL}/api/users/patients`, config),
                axios.get(`${API_BASE_URL}/api/treatments/all`, config).catch(() => ({ data: [] }))
            ]);

            setAppointments(resAppt.data || []);

            const today = new Date().toISOString().split('T')[0];
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            const todayAppts = resAppt.data.filter(a => a.date.split('T')[0] === today);
            const todayTreatments = resTreatments.data.filter(t => t.date && t.date.split('T')[0] === today);
            const monthTreatments = resTreatments.data.filter(t => t.date && new Date(t.date) >= monthStart);
            const todayRevenue = todayTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);
            const monthRevenue = monthTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);

            setStats({
                todayCount: todayAppts.length,
                pendingConfirmation: resAppt.data.filter(a => a.status === 'pending').length,
                totalPatients: resPatients.data.length,
                todayRevenue,
                monthRevenue
            });
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user.token) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user.token]);

    const handleConfirm = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_BASE_URL}/api/appointments/${id}`, { status: 'confirmed' }, config);
            fetchData();
        } catch (error) {
            alert('Failed to confirm appointment');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading Records...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Clean SaaS Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                        <p className="text-sm text-slate-500">Welcome back, {user.fullName.split(' ')[0]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/staff/book-appointment')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:transform active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            New Appointment
                        </button>
                    </div>
                </div>

                {/* Grid stats - Refined for mobile stacking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Today's Appointments", value: stats.todayCount, icon: "📅", color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Pending Approvals", value: stats.pendingConfirmation, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Active Patients", value: stats.totalPatients, icon: "👥", color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Clinic Revenue", value: `Rs. ${stats.todayRevenue}`, icon: "💰", color: "text-slate-600", bg: "bg-slate-50" }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{s.value}</h3>
                            </div>
                            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
                                {s.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Sessions List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Activity</h2>
                                <Link to="/staff/appointments" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All →</Link>
                            </div>
                            <div className="divide-y divide-slate-100 h-[480px] overflow-y-auto custom-scrollbar">
                                {appointments.length > 0 ? appointments.slice(0, 10).map(appt => (
                                    <div key={appt._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                                                {appt.patient?.fullName?.[0] || 'P'}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{appt.patient?.fullName || 'Walk-in'}</p>
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${appt.isFeePaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                                        {appt.isFeePaid ? 'Paid' : 'Due'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 font-medium">{appt.time} • {appt.reason}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {appt.status === 'pending' ? (
                                                <button 
                                                    onClick={() => handleConfirm(appt._id)}
                                                    className="w-full sm:w-auto px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                                                >
                                                    Confirm
                                                </button>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase text-center border ${
                                                    appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                                    appt.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                    {appt.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center px-4">
                                        <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100 text-xl">🗓️</div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase">No Reservations</h3>
                                        <p className="text-xs text-slate-400 mt-1">Schedules are clear for today.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Navigation</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { to: '/staff/appointments', label: 'Schedules', icon: '📅' },
                                    { to: '/staff/patients', label: 'Patients', icon: '👥' },
                                    { to: '/staff/billing', label: 'Payments', icon: '💰' },
                                    { to: '/staff/book-appointment', label: 'Booking', icon: '📝' }
                                ].map((btn, i) => (
                                    <Link 
                                        key={i} 
                                        to={btn.to} 
                                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                    >
                                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{btn.icon}</span>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-blue-600">{btn.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg shadow-slate-200 border border-slate-800">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Financial Overview</h2>
                            <div className="space-y-5">
                                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
                                    <p className="text-2xl font-bold text-white">Rs. {stats.todayRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Month to Date</p>
                                    <p className="text-xl font-bold text-white">Rs. {stats.monthRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
