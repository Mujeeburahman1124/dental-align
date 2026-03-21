import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Patient', _id: '0000' });
    const [nextAppointment, setNextAppointment] = useState(null);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [billingSummary, setBillingSummary] = useState({ outstandingBalance: 0, unpaidCount: 0, totalSpent: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const [resAppt, resSummary, resNotif, resProfile] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config),
                axios.get(`${API_BASE_URL}/api/payments/summary`, config),
                axios.get(`${API_BASE_URL}/api/notifications`, config),
                axios.get(`${API_BASE_URL}/api/users/profile`, config)
            ]);

            if (resProfile.data) {
                setUserInfo(prev => ({ ...prev, ...resProfile.data }));
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...resProfile.data }));
            }

            if (resAppt.data?.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Sort appointments by date descending for history
                const sortedAppts = [...resAppt.data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setAppointmentHistory(sortedAppts.filter(a => a.status === 'completed' || new Date(a.date).getTime() < today.getTime()));

                // Find next upcoming
                const upcoming = resAppt.data.find(a => {
                    const appDate = new Date(a.date);
                    appDate.setHours(0, 0, 0, 0);
                    const isTodayOrFuture = appDate.getTime() >= today.getTime();
                    return isTodayOrFuture && a.status !== 'cancelled' && a.status !== 'completed';
                });
                setNextAppointment(upcoming || null);
            }
            setBillingSummary(resSummary.data);
            setNotifications(resNotif.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s polling for real-time updates
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-semibold text-slate-500">Synchronizing Health Data...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header Section */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest">
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                            Patient Hub
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome, <span className="text-blue-600">{userInfo.fullName?.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-xs font-medium text-slate-500 italic opacity-80">
                            ID: {userInfo.patientId || 'NEW-USER'} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-full md:w-auto shadow-sm">
                        <Link to="/booking" className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-slate-900 transition-all text-center">
                            Book Visit
                        </Link>
                        <Link to="/patient/records" className="flex-1 md:flex-none px-6 py-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-center">
                            Records
                        </Link>
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Pending Payment', value: `Rs. ${billingSummary.outstandingBalance.toLocaleString()}`, icon: '💳', color: 'orange', sub: `${billingSummary.unpaidCount} Pending Invoices` },
                        { label: 'Health Status', value: 'Verified', icon: '🛡️', color: 'blue', sub: 'Active Profile' },
                        { label: 'Next Appointment', value: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None', icon: '📅', color: 'emerald', sub: nextAppointment ? `${nextAppointment.time}` : 'Register Visit' },
                        { label: 'Clinical History', value: `${appointmentHistory.length} Sessions`, icon: '📁', color: 'purple', sub: 'Full Log Sync' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-lg bg-${s.color}-50 text-sm flex items-center justify-center border border-${s.color}-100`}>{s.icon}</div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{s.label}</span>
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-1">{s.value}</div>
                            <div className="text-[10px] font-medium text-slate-400 italic opacity-80">{s.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    {/* Next Appointment Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Clinical Focus</h2>
                            {nextAppointment && <Link to="/patient/appointments" className="text-[10px] font-bold text-blue-600 hover:text-slate-900 uppercase">Manage All</Link>}
                        </div>

                        {nextAppointment ? (
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group">
                                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-bold uppercase tracking-wider">Confirmed Booking</div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{nextAppointment.reason || 'Dental Checkup'}</h3>
                                            <p className="text-sm text-slate-500 font-medium italic opacity-80">Primary consult with clinical specialist.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                                            <div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Doctor</div>
                                                <div className="text-sm font-bold text-slate-900">Dr. {nextAppointment.dentist?.fullName || 'TBA'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clinical Hub</div>
                                                <div className="text-sm font-bold text-slate-900">{nextAppointment.branch?.name || 'Main Center'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-3 justify-center">
                                        <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Date</div>
                                            <div className="text-lg font-bold text-slate-900">{new Date(nextAppointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div className="flex-1 bg-blue-600 p-4 rounded-xl text-center shadow-lg shadow-blue-500/20">
                                            <div className="text-[9px] font-bold text-blue-200 uppercase mb-1">Time</div>
                                            <div className="text-lg font-bold text-white">{nextAppointment.time}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-100 p-10 text-center shadow-sm">
                                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-50 font-bold">!</div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase">No Active Bookings</h3>
                                <p className="text-xs text-slate-400 my-4 italic opacity-80">Sync your health schedule by booking a new visit.</p>
                                <Link to="/booking" className="inline-block px-8 py-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-xl transition-all">Book Now</Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Access Side Grid */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Health Toolkit</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { title: 'Billing Center', sub: 'Settlements & History', icon: '💸', path: '/patient/billing' },
                                { title: 'Health Library', sub: 'Treatment Records', icon: '📂', path: '/patient/records' },
                                { title: 'Profile Metrics', sub: 'Personal Data Settings', icon: '👤', path: '/patient/profile' }
                            ].map((item, i) => (
                                <Link key={i} to={item.path} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-500 hover:bg-slate-50 transition-all group font-sans">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 text-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">{item.icon}</div>
                                    <div className="flex-1 text-left">
                                        <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.title}</div>
                                        <div className="text-[10px] text-slate-400 font-medium italic">{item.sub}</div>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 group-hover:text-blue-600"><path d="M9 18l6-6-6-6" /></svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Feed</h2>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">RECENT</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {notifications.length > 0 ? (
                            notifications.slice(0, 3).map(notif => (
                                <div key={notif._id} className="p-5 flex gap-4 hover:bg-slate-50 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 font-bold border border-blue-100">!</div>
                                    <div>
                                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic opacity-90">{notif.message}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tight">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-400 text-[10px] font-bold uppercase italic opacity-60">No recent updates in your health feed</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
