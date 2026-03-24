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
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const [resAppt, resSummary, resProfile] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/payments/summary`, config).catch(() => ({ data: { outstandingBalance: 0, unpaidCount: 0, totalSpent: 0 } })),
                axios.get(`${API_BASE_URL}/api/users/profile`, config).catch(() => ({ data: null }))
            ]);

            if (resProfile.data) {
                setUserInfo(prev => ({ ...prev, ...resProfile.data }));
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...resProfile.data }));
            }

            if (resAppt.data?.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sortedAppts = [...resAppt.data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setAppointmentHistory(sortedAppts.filter(a => a.status === 'completed' || new Date(a.date).getTime() < today.getTime()));

                const upcoming = resAppt.data.find(a => {
                    const appDate = new Date(a.date);
                    appDate.setHours(0, 0, 0, 0);
                    return appDate.getTime() >= today.getTime() && a.status !== 'cancelled' && a.status !== 'completed';
                });
                setNextAppointment(upcoming || null);
            }
            if (resSummary.data) setBillingSummary(resSummary.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">Loading Records...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                    <div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Patient Portal</div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Welcome, {userInfo.fullName?.split(' ')[0]}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Patient ID: {userInfo.patientId || 'N/A'} | {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link to="/patient/records" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors">
                            Clinical Records
                        </Link>
                        <Link to="/booking" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700 transition-colors">
                            Book Appointment
                        </Link>
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {[
                        { label: 'Outstanding Balance', value: `Rs. ${billingSummary.outstandingBalance.toLocaleString()}`, sub: `${billingSummary.unpaidCount} Pending Invoices` },
                        { label: 'Profile Status', value: 'Active / Verified', sub: 'Information up to date' },
                        { label: 'Upcoming Visit', value: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None', sub: nextAppointment ? nextAppointment.time : 'No visits scheduled' },
                        { label: 'Clinical History', value: `${appointmentHistory.length} Sessions`, sub: 'Fully synchronized' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded border border-slate-200 shadow-sm flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</span>
                            <div className="text-lg font-bold text-slate-900 tracking-tight mb-1">{s.value}</div>
                            <div className="text-[10px] font-medium text-slate-500">{s.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Next Appointment Card */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next Appointment</h2>
                            {nextAppointment && <Link to="/patient/appointments" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</Link>}
                        </div>

                        {nextAppointment ? (
                            <div className="bg-white rounded border border-slate-200 shadow-sm flex-1 p-5 md:p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[9px] font-bold uppercase tracking-widest rounded border border-green-200 mb-2">Confirmed</span>
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{nextAppointment.reason || 'General Consultation'}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physician</div>
                                            <div className="text-sm font-semibold text-slate-900">Dr. {nextAppointment.dentist?.fullName || 'TBA'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Facility</div>
                                            <div className="text-sm font-semibold text-slate-900">{nextAppointment.branch?.name || 'Main Dental Center'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center min-w-[140px] shrink-0">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Schedule</div>
                                    <div className="text-lg font-bold text-slate-900 tracking-tight">{new Date(nextAppointment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                    <div className="text-sm font-bold text-blue-600 mt-1">{nextAppointment.time}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded border border-slate-200 p-8 text-center flex-1 flex flex-col items-center justify-center shadow-sm">
                                <h3 className="text-sm font-bold text-slate-700 mb-2">No Scheduled Appointments</h3>
                                <p className="text-xs font-medium text-slate-500 mb-5">You do not have any upcoming visits scheduled at this time.</p>
                                <Link to="/booking" className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow hover:bg-blue-700 transition-colors">Book a Visit</Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Access List */}
                    <div className="flex flex-col">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Links</h2>
                        <div className="bg-white border border-slate-200 rounded shadow-sm divide-y divide-slate-100 flex-1">
                            {[
                                { title: 'Billing & Invoices', sub: 'View statements and make payments', path: '/patient/billing' },
                                { title: 'Treatment Records', sub: 'Access your clinical history', path: '/patient/records' },
                                { title: 'Account Settings', sub: 'Update personal information', path: '/patient/profile' }
                            ].map((item, i) => (
                                <Link key={i} to={item.path} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                        <div className="text-xs font-medium text-slate-500 mt-1">{item.sub}</div>
                                    </div>
                                    <span className="text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PatientDashboard;
