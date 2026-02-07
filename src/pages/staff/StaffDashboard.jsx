import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffDashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff Member' };
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ todayCount: 0, pendingConfirmation: 0, totalPatients: 0 });
    const [loading, setLoading] = useState(true);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const resAppt = await axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config);
            setAppointments(resAppt.data || []);

            const today = new Date().toISOString().split('T')[0];
            const todayAppts = resAppt.data.filter(a => a.date.split('T')[0] === today);
            setStats({
                todayCount: todayAppts.length,
                pendingConfirmation: resAppt.data.filter(a => a.status === 'pending').length,
                totalPatients: [...new Set(resAppt.data.map(a => a.patient?._id))].length
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleConfirm = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_BASE_URL}/api/appointments/${id}`, { status: 'confirmed' }, config);
            fetchData();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleGenerateInvoice = (appt) => {
        setSelectedAppt(appt);
        setShowInvoiceModal(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
                {/* Header - Compact */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900">Staff Dashboard</h1>
                    <p className="text-sm text-gray-600">Manage clinic operations</p>
                </div>

                {/* Stats - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Today's Visits</div>
                        <div className="text-2xl md:text-3xl font-black text-gray-900">{stats.todayCount}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Pending</div>
                        <div className="text-2xl md:text-3xl font-black text-orange-600">{stats.pendingConfirmation}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
                        <div className="text-xs font-bold text-gray-500 mb-1">Total Patients</div>
                        <div className="text-2xl md:text-3xl font-black text-green-600">{stats.totalPatients}</div>
                    </div>
                </div>

                {/* Quick Actions - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <Link to="/staff/appointments" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">📅</div>
                        <div className="text-xs font-bold text-gray-900">Appointments</div>
                    </Link>
                    <Link to="/staff/patients" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">👥</div>
                        <div className="text-xs font-bold text-gray-900">Patients</div>
                    </Link>
                    <Link to="/staff/billing" className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">📝</div>
                        <div className="text-xs font-bold text-gray-900">Billing</div>
                    </Link>
                    <Link to="/staff/book-appointment" className="bg-indigo-600 p-4 rounded-xl text-center hover:shadow-lg transition-all">
                        <div className="text-2xl mb-2">➕</div>
                        <div className="text-xs font-bold text-white">Book for Patient</div>
                    </Link>
                </div>

                {/* Appointment Queue - Compact */}
                <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-black text-gray-900">Appointment Queue</h2>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Live</span>
                    </div>
                    <div className="space-y-2">
                        {appointments.length > 0 ? appointments.map(appt => (
                            <div key={appt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                        {appt.patient?.fullName ? appt.patient.fullName[0] : 'P'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-gray-900 truncate">{appt.patient?.fullName || 'Guest'}</div>
                                        <div className="text-xs text-gray-600 truncate">{appt.reason} • {appt.time}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0 ml-2">
                                    {appt.status === 'pending' && (
                                        <button onClick={() => handleConfirm(appt._id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">
                                            Confirm
                                        </button>
                                    )}
                                    {appt.status === 'completed' && !appt.isFeePaid && (
                                        <button onClick={() => handleGenerateInvoice(appt)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                                            Bill
                                        </button>
                                    )}
                                    {appt.status === 'confirmed' && (
                                        <span className="px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 rounded-lg">Active</span>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-500">
                                <span className="block text-3xl mb-2">📋</span>
                                <p className="text-sm">No appointments today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Card - Compact */}
                <div className="bg-indigo-600 p-6 rounded-2xl text-white">
                    <h3 className="text-base font-bold mb-2">Today's Revenue</h3>
                    <div className="text-3xl font-black">Rs. 18,500</div>
                    <p className="text-indigo-200 text-xs mt-2">+12% from yesterday</p>
                </div>
            </div>

            {/* Invoice Modal - Compact */}
            {showInvoiceModal && selectedAppt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900">Generate Bill</h2>
                            <p className="text-sm text-gray-600 mt-1">For {selectedAppt.patient?.fullName}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Treatment:</span>
                                <span className="font-bold text-gray-900">{selectedAppt.reason}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Cost:</span>
                                <span className="font-bold text-gray-900">Rs. {selectedAppt.estimatedCost?.toLocaleString() || '0'}</span>
                            </div>
                            {!selectedAppt.isFeePaid && (
                                <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                                    <span className="text-indigo-600">Booking Fee:</span>
                                    <span className="font-bold text-indigo-600">Rs. {selectedAppt.bookingFee || 500}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t border-gray-200 pt-3">
                                <span className="font-bold text-gray-900">Total:</span>
                                <span className="text-2xl font-black text-indigo-600">
                                    Rs. {((selectedAppt.estimatedCost || 0) + (!selectedAppt.isFeePaid ? 500 : 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    alert('Invoice generated successfully!');
                                    setShowInvoiceModal(false);
                                }}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm"
                            >
                                Complete & Print
                            </button>
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="w-full text-gray-600 text-sm font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
