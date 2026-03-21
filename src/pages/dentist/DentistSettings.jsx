import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const DentistSettings = () => {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem('userInfo')) || {};
    const selectedDentistId = localStorage.getItem('selectedDentistId') || loggedInUser._id;

    const [user, setUser] = useState({
        fullName: 'Dr. Dentist',
        email: 'dentist@dentalalign.com',
        phone: '',
        slmcNumber: '',
        specialization: ''
    });

    const [isOwnProfile, setIsOwnProfile] = useState(selectedDentistId === loggedInUser._id);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setIsOwnProfile(selectedDentistId === loggedInUser._id);
        if (selectedDentistId === loggedInUser._id) {
            setUser(loggedInUser);
        } else {
            // Fetch the selected dentist's details
            axios.get(`${API_BASE_URL}/api/users/dentists`)
                .then(({ data }) => {
                    const found = data.find(d => d._id === selectedDentistId);
                    if (found) setUser(found);
                })
                .catch(console.error);
        }
    }, [selectedDentistId]);

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${loggedInUser.token}`
                }
            };
            const payload = { ...user };
            if (newPassword && newPassword === confirmPassword) {
                payload.password = newPassword;
            } else if (newPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match.' });
                setSaving(false);
                return;
            }
            const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, payload, config);
            const updatedUser = { ...data, token: loggedInUser.token };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="mb-8 sm:mb-12">
                    <div className="space-y-2">
                        <Link to="/dentist/dashboard" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                            {isOwnProfile ? 'Update your professional profile and security preferences.' : `Viewing professional profile for ${user.fullName}.`}
                        </p>
                    </div>
                </header>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl text-sm font-bold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
                        {message.text}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Professional Profile */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Professional Profile</h2>
                        </div>
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold border border-blue-100 shadow-sm shrink-0">
                                    {user.fullName?.[0] || 'D'}
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-xl font-bold text-gray-900">{user.fullName}</p>
                                    <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mt-1">Dentist Portal Access</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={user.fullName || ''}
                                        onChange={handleChange}
                                        disabled={!isOwnProfile}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={user.email || ''}
                                        onChange={handleChange}
                                        disabled={!isOwnProfile}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        name="phone"
                                        value={user.phone || ''}
                                        onChange={handleChange}
                                        disabled={!isOwnProfile}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                        placeholder="0112 345 678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SLMC License No.</label>
                                    <input
                                        name="slmcNumber"
                                        value={user.slmcNumber || ''}
                                        onChange={handleChange}
                                        disabled={!isOwnProfile}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                        placeholder="SLMC-XXXX"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</label>
                                    <input
                                        name="specialization"
                                        value={user.specialization || ''}
                                        onChange={handleChange}
                                        disabled={!isOwnProfile}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                        placeholder="e.g. Cosmetic Dentistry, Orthodontics"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {isOwnProfile && (
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">Security Settings</h2>
                            </div>
                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {isOwnProfile && (
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => navigate('/dentist/dashboard')}
                                className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm active:scale-95"
                            >
                                {saving ? 'Updating...' : 'Update Settings'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DentistSettings;
