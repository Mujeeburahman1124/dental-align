import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

const AdminSchedule = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        timeSlots: [],
        workingDays: [],
        holidays: []
    });
    const [loading, setLoading] = useState(true);
    const [newSlot, setNewSlot] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user.token || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/settings`);
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = () => {
        if (newSlot && !settings.timeSlots.includes(newSlot)) {
            setSettings({ ...settings, timeSlots: [...settings.timeSlots, newSlot].sort() });
            setNewSlot('');
        }
    };

    const handleRemoveSlot = (slot) => {
        setSettings({ ...settings, timeSlots: settings.timeSlots.filter(s => s !== slot) });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${API_BASE_URL}/api/settings`, settings, config);
            alert('Schedule updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update schedule');
        } finally {
            setSaving(false);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const toggleDay = (day) => {
        const currentDays = settings.workingDays;
        if (currentDays.includes(day)) {
            setSettings({ ...settings, workingDays: currentDays.filter(d => d !== day) });
        } else {
            setSettings({ ...settings, workingDays: [...currentDays, day] });
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-semibold text-gray-500 ml-4">Loading Schedule...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-6">
                    <div className="space-y-2">
                        <Link to="/admin/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Clinic Schedule</h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">Configure clinic working days and appointment time slots.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </header>

                <div className="space-y-6 sm:space-y-8">
                    {/* Working Days Card */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Working Days</h2>
                                <p className="text-sm text-gray-500 font-medium">Select days the clinic is open for appointments</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {days.map(day => {
                                const isActive = settings.workingDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`px-3 py-4 rounded-xl text-xs font-bold transition-all border-2 active:scale-95 flex flex-col items-center justify-center gap-1 ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                            : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="opacity-60">{day.substring(0, 3)}</div>
                                        <div className="text-[10px] uppercase font-bold">{isActive ? 'Open' : 'Closed'}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Time Slots Card */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Appointment Time Slots</h2>
                                <p className="text-sm text-gray-500 font-medium">Manage available time slots for bookings</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                placeholder="e.g. 09:30 AM"
                                className="w-full sm:max-w-xs px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                            />
                            <button
                                onClick={handleAddSlot}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-sm active:scale-95 whitespace-nowrap"
                            >
                                Add Slot
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {settings.timeSlots.length > 0 ? settings.timeSlots.map((slot, index) => (
                                <div key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-blue-100 group hover:bg-blue-100 transition-colors">
                                    {slot}
                                    <button
                                        onClick={() => handleRemoveSlot(slot)}
                                        className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-200 text-blue-600 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            )) : (
                                <div className="w-full py-12 text-center text-sm font-medium text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">No time slots defined</div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-3">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500 mt-0.5 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-2xl">
                                Note: Modifying time slots updates future availability. Existing appointments and historical records will not be affected.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminSchedule;
