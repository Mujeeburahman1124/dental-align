import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const DentistSettings = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || {
        fullName: 'Dr. Dentist',
        email: 'dentist@dentalalign.com',
        phone: '0777654321',
        slmcNumber: '',
        specialization: 'Cosmetic Dentistry'
    });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', user, config);
            // Merge with existing token
            const updatedUser = { ...data, token: user.token };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Profile Updated Successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-8 font-inter">
            <div className="bg-white w-full max-w-[1440px] flex rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-gray-50 flex flex-col h-full bg-white">
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-[#111827]">DentAlign</span>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Settings Portal</div>
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
                        <Link to="/dentist/calendar" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">🗓️</span>Calendar
                        </Link>
                        <Link to="/dentist/settings" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold bg-[#007AFF]/10 text-[#007AFF]">
                            <span className="text-xl">⚙️</span>Settings
                        </Link>
                    </nav>
                    <div className="p-6">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight mb-2">Account Settings</h1>
                        <p className="text-gray-400 font-bold mb-10">Manage your profile and security preferences</p>

                        {/* Profile Section */}
                        <section className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#111827]">Profile Information</h2>
                                <button className="text-sm font-bold text-[#007AFF] hover:underline">Edit Profile</button>
                            </div>

                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-[32px] bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl">
                                        👨‍⚕️
                                    </div>
                                    <div>
                                        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold mb-2 hover:bg-black transition-all">Change Photo</button>
                                        <p className="text-xs text-gray-400 font-bold tracking-tight">JPG, GIF or PNG. 1MB Max.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                                        <input
                                            name="fullName" value={user.fullName} onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                                        <input
                                            name="email" value={user.email} onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                                        <input
                                            name="phone" value={user.phone} onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">SLMC Registration</label>
                                        <input
                                            name="slmcNumber" value={user.slmcNumber || ''} onChange={handleChange}
                                            placeholder="SLMC-XXXX"
                                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-[#111827] mb-6">Security & Privacy</h2>
                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">New Password</label>
                                            <input
                                                type="password"
                                                className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[#111827] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10 flex justify-end">
                                    <button onClick={handleSave} className="bg-[#007AFF] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-[#0066D6] transition-all transform hover:scale-[1.02]">
                                        Save All Changes
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DentistSettings;
