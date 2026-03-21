import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const DentistCalendar = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(localStorage.getItem('selectedDentistId') || user._id || '');

    useEffect(() => {
        if (selectedDentist) localStorage.setItem('selectedDentistId', selectedDentist);
    }, [selectedDentist]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/dentists`)
            .then(({ data }) => {
                setDentists(data);
                if (user.role !== 'dentist' && data.length > 0 && !selectedDentist) {
                    setSelectedDentist(data[0]._id);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedDentist) return;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        axios.get(`${API_BASE_URL}/api/appointments/dentist/${selectedDentist}`, config)
            .then(({ data }) => setAppointments(data))
            .catch(console.error);
    }, [selectedDentist, user.token]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays = [
        ...Array.from({ length: firstDay }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const getAppointmentsForDay = (day) => {
        if (!day) return [];
        return appointments.filter(app => {
            const d = new Date(app.date);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });
    };

    const today = new Date();
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="mb-8 sm:mb-12 flex flex-col xl:flex-row justify-between xl:items-end gap-6">
                    <div className="space-y-2">
                        <Link to="/dentist/dashboard" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Appointment Calendar</h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                            {MONTH_NAMES[month]} {year} &nbsp;•&nbsp; Monthly schedule for Dr. {dentists.find(d => d._id === selectedDentist)?.fullName.split(' ').pop() || 'Dentist'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                        {dentists.length > 1 && (
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={selectedDentist}
                                    onChange={e => setSelectedDentist(e.target.value)}
                                    className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
                                >
                                    {dentists.map(d => (
                                        <option key={d._id} value={d._id}>Dr. {d.fullName.split(' ').pop()}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </header>

                {/* Calendar Grid */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-r border-gray-100 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 border-collapse">
                        {calendarDays.map((day, idx) => {
                            const dayAppts = getAppointmentsForDay(day);
                            const isToday = day &&
                                day === today.getDate() &&
                                month === today.getMonth() &&
                                year === today.getFullYear();

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[100px] sm:min-h-[140px] p-2 border-b border-r border-gray-100 last:border-r-0 relative transition-colors ${!day ? 'bg-gray-50/30' : 'hover:bg-blue-50/40'}`}
                                >
                                    {day && (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg transition-colors
                                                    ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 font-medium'}`}>
                                                    {day}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 overflow-hidden">
                                                {dayAppts.slice(0, 3).map((app, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-[10px] font-bold px-2 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 truncate shadow-sm cursor-default hover:bg-blue-100 transition-colors"
                                                    >
                                                        {app.time} &nbsp;{app.patient?.fullName?.split(' ')[0] || 'Walk-in'}
                                                    </div>
                                                ))}
                                                {dayAppts.length > 3 && (
                                                    <div className="text-[10px] font-bold text-gray-400 pl-1 mt-1">
                                                        + {dayAppts.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                            {dayAppts.length > 0 && (
                                                <div className="sm:hidden absolute bottom-1 right-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 block shadow-sm"></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                    </div>

                    {appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-20 text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="font-bold text-gray-900">All clear!</h3>
                            <p className="text-sm text-gray-500 mt-1">No upcoming appointments scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {appointments
                                .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 8)
                                .map(appt => (
                                    <div key={appt._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-14 h-14 bg-gray-50 text-gray-700 border border-gray-100 rounded-2xl flex flex-col items-center justify-center shrink-0">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">
                                                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold text-gray-900 leading-none">
                                                    {new Date(appt.date).getDate()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{appt.patient?.fullName || 'Walk-in'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{appt.time} &nbsp;•&nbsp; <span className="text-blue-600 font-bold">{appt.reason || 'Routine Visit'}</span></p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border shrink-0 ${appt.status === 'in-treatment' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                appt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                            {appt.status === 'in-treatment' ? 'In Treatment' : appt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DentistCalendar;
