import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffAppointments = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAppointments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
            setAppointments(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user.token]);

    const handleConfirm = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: 'confirmed' }, config);
            fetchAppointments();
            alert('Appointment confirmed!');
        } catch (error) {
            alert('Failed to confirm appointment');
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: 'cancelled' }, config);
            fetchAppointments();
            alert('Appointment cancelled!');
        } catch (error) {
            alert('Failed to cancel appointment');
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        if (filter === 'all') return true;
        return appt.status === filter;
    });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Appointments Management</h1>
                        <p className="text-sm text-gray-600">View and manage all appointments</p>
                    </div>
                    <button
                        onClick={() => navigate('/staff/book-appointment')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 justify-center"
                    >
                        <span className="text-lg">➕</span>
                        Book Appointment
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl border border-gray-100 p-1 mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        All ({appointments.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'pending' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Pending ({appointments.filter(a => a.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('confirmed')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
                    </button>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                    {filteredAppointments.length > 0 ? filteredAppointments.map(appt => (
                        <div key={appt._id} className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                        {appt.patient?.fullName ? appt.patient.fullName[0] : 'P'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900">{appt.patient?.fullName || 'Guest Patient'}</div>
                                        <div className="text-sm text-gray-600 mt-1">{appt.reason}</div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">📅 {new Date(appt.date).toLocaleDateString()}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">🕐 {appt.time}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">👨‍⚕️ Dr. {appt.dentist?.fullName || 'TBA'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${appt.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                        appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {appt.status.toUpperCase()}
                                    </span>
                                    {appt.status === 'pending' && (
                                        <button
                                            onClick={() => handleConfirm(appt._id)}
                                            className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                        <button
                                            onClick={() => handleCancel(appt._id)}
                                            className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                            <div className="text-4xl mb-3">📅</div>
                            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} appointments found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffAppointments;
