import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DentistCalendar = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Dr. Muksith' });
    const [appointments, setAppointments] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, [user.token]);

    // Calendar Generation Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => null);
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarDays = [...prevMonthDays, ...currentDays];

    const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const getAppointmentsForDay = (day) => {
        if (!day) return [];
        return appointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate.getFullYear() === year && appDate.getMonth() === month && appDate.getDate() === day;
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-8 font-inter">
            <div className="bg-white w-full max-w-[1440px] flex rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-gray-50 flex flex-col h-full bg-white">
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-[#111827]">DentAlign</span>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dentist Portal</div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <Link to="/dentist/dashboard" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">📅</span>Dashboard
                        </Link>
                        <Link to="/dentist/records" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">📋</span>Treatment Records
                        </Link>
                        <Link to="/dentist/prescriptions" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">💊</span>Prescriptions
                        </Link>
                        <Link to="/dentist/calendar" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold bg-[#007AFF]/10 text-[#007AFF]">
                            <span className="text-xl">🗓️</span>Calendar
                        </Link>
                        <Link to="/dentist/settings" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">⚙️</span>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Calendar Content */}
                <main className="flex-1 p-6 bg-white overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#111827] capitalize">
                                    {currentMonth.toLocaleString('default', { month: 'long' })} {year}
                                </h1>
                                <p className="text-gray-400 font-bold mt-2">Manage your monthly schedule</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handlePrevMonth} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">◀ Previous</button>
                                <button onClick={handleNextMonth} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">Next ▶</button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            {/* Days */}
                            <div className="grid grid-cols-7 bg-gray-50/20">
                                {calendarDays.map((day, idx) => {
                                    const dayAppointments = getAppointmentsForDay(day);
                                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                    return (
                                        <div key={idx} className={`min-h-[80px] p-1 border-b border-r border-gray-50 hover:bg-white transition-colors relative group ${!day ? 'bg-gray-50/50' : ''}`}>
                                            {day && (
                                                <>
                                                    <span className={`text-sm font-bold ${isToday ? 'text-white bg-[#007AFF] w-8 h-8 rounded-full flex items-center justify-center' : 'text-gray-400'}`}>
                                                        {day}
                                                    </span>
                                                    <div className="mt-2 space-y-1">
                                                        {dayAppointments.map((app, i) => (
                                                            <div key={i} className="text-[10px] font-bold px-2 py-1.5 rounded-lg border truncate bg-blue-50 text-blue-600 border-blue-100">
                                                                {app.time} - {app.patient?.fullName || 'Patient'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DentistCalendar;
