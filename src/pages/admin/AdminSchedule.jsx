import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

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

    if (loading) return <div className="p-10 text-center">Loading settings...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Clinic Schedule Configuration</h1>
                        <p className="text-sm text-gray-600">Manage operating hours and appointment slots</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="grid gap-6">
                    {/* Working Days */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-lg mb-4">Working Days</h2>
                        <div className="flex flex-wrap gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${settings.workingDays.includes(day)
                                            ? 'bg-green-100 text-green-700 border-2 border-green-200'
                                            : 'bg-gray-100 text-gray-400 border-2 border-transparent hover:bg-gray-200'
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-lg mb-4">Appointment Slots</h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                placeholder="e.g. 09:00 AM"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-full max-w-xs"
                            />
                            <button
                                onClick={handleAddSlot}
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800"
                            >
                                Add Slot
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {settings.timeSlots.map((slot, index) => (
                                <div key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border border-indigo-100">
                                    {slot}
                                    <button
                                        onClick={() => handleRemoveSlot(slot)}
                                        className="text-indigo-400 hover:text-red-500 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Note: Adding slots enables them for booking. Existing bookings are not affected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;
