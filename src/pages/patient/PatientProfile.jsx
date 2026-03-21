import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { API_BASE_URL } from '../../config';

const PatientProfile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) {
                    window.location.href = '/login';
                    return;
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);
                setUser(data);
                setFormData({
                    fullName: data.fullName || '',
                    age: data.age || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    password: '',
                    confirmPassword: ''
                });
            } catch (err) {
                setError('Failed to load profile information.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setUpdating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, {
                fullName: formData.fullName,
                age: formData.age,
                email: formData.email,
                phone: formData.phone,
                password: formData.password || undefined
            }, config);

            const updatedUserInfo = { ...userInfo, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setUser(data);
            setMessage('Profile updated successfully.');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <header className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
                            Account Hub
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Security & Profile</h1>
                    </div>
                </header>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-w-0">
                    <div className="p-6 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 min-w-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg shrink-0 uppercase">
                                {user?.fullName?.charAt(0) || 'P'}
                            </div>
                            <div className="text-center sm:text-left min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">{user?.fullName || 'Patient'}</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">ID: <span className="text-blue-600 font-mono tracking-normal">{user?.patientId || 'A-0000'}</span></p>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100 flex items-center gap-2 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Verified
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10 relative z-10">
                        {message && (
                            <div className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider p-4 rounded-xl flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}

                        <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Personal Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Full Name</label>
                                    <input
                                        type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Full Name" required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Age</label>
                                    <input
                                        type="number" name="age" value={formData.age} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Phone</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="+94 XXX XXXXXX" required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Email</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1.5 h-4 bg-gray-900 rounded-full"></div>
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Security Update</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">New Password</label>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Leave blank to keep same"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Confirm Password</label>
                                    <input
                                        type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Confirm passcode"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-gray-100 disabled:opacity-50 active:scale-95"
                            >
                                {updating ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PatientProfile;
