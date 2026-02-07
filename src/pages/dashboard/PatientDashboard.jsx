import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const PatientDashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Patient', _id: '0000' };
    const navigate = useNavigate();
    const [nextAppointment, setNextAppointment] = useState(null);
    const [billingSummary, setBillingSummary] = useState({ outstandingBalance: 0, unpaidCount: 0, totalSpent: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token} ` } };
            const [resAppt, resSummary, resNotif] = await Promise.all([
                axios.get(`${API_BASE_URL} /api/appointments / my - appointments`, config),
                axios.get(`${API_BASE_URL} /api/payments / summary`, config),
                axios.get(`${API_BASE_URL} /api/notifications`, config)
            ]);

            if (resAppt.data?.length > 0) {
                const upcoming = resAppt.data.find(a => new Date(a.date) >= new Date() && a.status !== 'cancelled');
                setNextAppointment(upcoming || resAppt.data[0]);
            }
            setBillingSummary(resSummary.data);
            setNotifications(resNotif.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-600">Welcome back, {user.fullName}</p>
                </div>

                {/* Stats - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Outstanding</div>
                        <div className="text-xl md:text-2xl font-black text-orange-600">Rs. {billingSummary.outstandingBalance.toLocaleString()}</div>
                        <Link to="/patient/billing" className="text-xs text-blue-600 font-bold mt-2 inline-block">Pay Now →</Link>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Total Spent</div>
                        <div className="text-xl md:text-2xl font-black text-gray-900">Rs. {billingSummary.totalSpent?.toLocaleString() || '0'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
                        <div className="text-xs font-bold text-gray-500 mb-1">Status</div>
                        <div className="text-xl md:text-2xl font-black text-green-600">Active</div>
                    </div>
                </div>

                {/* Next Appointment - Compact */}
                <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-4">Next Appointment</h2>
                    {nextAppointment ? (
                        <div className="space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl text-center min-w-[60px]">
                                    <div className="text-xs font-bold text-blue-600">{new Date(nextAppointment.date).toLocaleString('default', { month: 'short' })}</div>
                                    <div className="text-2xl font-black text-gray-900">{new Date(nextAppointment.date).getDate()}</div>
                                    <div className="text-xs font-bold text-gray-600">{nextAppointment.time}</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-base text-gray-900">{nextAppointment.reason}</h3>
                                    <p className="text-sm text-gray-600">Dr. {nextAppointment.dentist?.fullName || 'TBA'}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Confirmed</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link to="/patient/appointments" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold text-center">
                                    View Details
                                </Link>
                                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold">
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📅</div>
                            <p className="text-sm text-gray-600 mb-4">No upcoming appointments</p>
                            <Link to="/booking" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold">
                                Book Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <Link to="/booking" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">📅</div>
                        <div className="text-xs font-bold text-gray-900">Book</div>
                    </Link>
                    <Link to="/patient/billing" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-xs font-bold text-gray-900">Billing</div>
                    </Link>
                    <Link to="/patient/records" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-xs font-bold text-gray-900">Records</div>
                    </Link>
                    <Link to="/patient/appointments" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">📜</div>
                        <div className="text-xs font-bold text-gray-900">History</div>
                    </Link>
                </div>

                {/* Recent Activity - Compact */}
                <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        {notifications.length > 0 ? notifications.slice(0, 4).map(n => (
                            <div key={n._id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                <div className={`w - 8 h - 8 rounded - lg flex items - center justify - center text - lg shrink - 0 ${n.type === 'appointment' ? 'bg-blue-100' :
                                        n.type === 'payment' ? 'bg-green-100' : 'bg-gray-100'
                                    } `}>
                                    {n.type === 'appointment' ? '📅' : n.type === 'payment' ? '💳' : 'ℹ️'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 line-clamp-2">{n.message}</p>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6 text-sm text-gray-500">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
