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
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                {/* Academic Medical Header */}
                <header className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                            Front Desk Operations
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none">
                            Clinical <span className="text-blue-600">Dashboard</span>
                        </h1>
                        <p className="mt-3 text-sm font-medium text-slate-500 italic opacity-80">
                            Authenticated administrative access for {user.fullName}.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/staff/book-appointment')}
                            className="bg-slate-900 text-white px-8 py-4 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3"
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                            New Registry
                        </button>
                    </div>
                </header>

                {/* Clinical KPIs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                    {[
                        { label: "Daily Appointments", value: stats.todayCount, icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Pending Approvals", value: stats.pendingConfirmation, icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Active Faculty", value: "88%", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Collection Rate", value: "94.2%", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, color: "text-slate-600", bg: "bg-slate-50" }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-400 hover:shadow-lg transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</h3>
                            </div>
                            <div className={`${s.bg} ${s.color} w-12 h-12 rounded flex items-center justify-center border border-slate-100`}>
                                {s.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Log */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Patient Registry Status</h2>
                                <Link to="/staff/appointments" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">Full Records →</Link>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                {appointments.length > 0 ? appointments.slice(0, 15).map(appt => (
                                    <div key={appt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded border border-slate-200 flex items-center justify-center font-black text-[10px] uppercase">
                                                {appt.patient?.fullName?.[0] || 'N'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{appt.patient?.fullName || 'Anonymous Patient'}</p>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${appt.isFeePaid ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {appt.isFeePaid ? 'Settled' : 'Payment Due'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                                                    {appt.time} • <span className="text-blue-600">{appt.reason}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {appt.status === 'pending' ? (
                                                <button 
                                                    onClick={() => handleConfirm(appt._id)}
                                                    className="px-6 py-2.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                                >
                                                    Authenticate
                                                </button>
                                            ) : (
                                                <span className={`px-3 py-1.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                    appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                    appt.status === 'completed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}>
                                                    Status: {appt.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center">
                                        <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-6">
                                            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Zero Records Found</h3>
                                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Awaiting daily session initiations.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Faculty Core Navigation */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded border border-slate-200 shadow-sm">
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Core Operations</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { to: '/staff/appointments', label: 'Schedules', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"></path></svg> },
                                    { to: '/staff/patients', label: 'Faculty', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                                    { to: '/staff/billing', label: 'Ledger', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
                                    { to: '/staff/book-appointment', label: 'Registry', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> }
                                ].map((btn, i) => (
                                    <Link 
                                        key={i} 
                                        to={btn.to} 
                                        className="flex flex-col items-center justify-center p-6 rounded border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all group"
                                    >
                                        <div className="mb-3 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                                            {btn.icon}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900">{btn.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Performance Card */}
                        <div className="bg-slate-900 p-8 rounded text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] -mr-24 -mt-24 opacity-20"></div>
                            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 relative z-10">Financial Yield</h2>
                            <div className="space-y-6 relative z-10">
                                <div className="p-5 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Collection (Today)</p>
                                    <p className="text-3xl font-black tracking-tighter">Rs. {stats.todayRevenue.toLocaleString()}</p>
                                </div>
                                <div className="p-5 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Operational Gross (Month)</p>
                                    <p className="text-xl font-black tracking-tighter opacity-80">Rs. {stats.monthRevenue.toLocaleString()}</p>
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
