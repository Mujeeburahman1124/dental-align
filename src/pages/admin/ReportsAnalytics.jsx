import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ReportsAnalytics = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin User' };
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const monthlyRevenue = [
        { month: 'Jan', rev: 380, h: '60%' },
        { month: 'Feb', rev: 420, h: '70%' },
        { month: 'Mar', rev: 395, h: '65%' },
        { month: 'Apr', rev: 450, h: '80%' },
        { month: 'May', rev: 480, h: '90%' },
        { month: 'Jun', rev: 485, h: '95%' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar - Consistent with Dashboard */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600">
                        <span className="text-2xl">🦷</span>
                        <span className="text-xl font-bold tracking-tight text-gray-900">DentAlign</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">Clinic Administration</div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
                        <span className="text-lg">📊</span>
                        <span className="font-semibold text-sm">Dashboard</span>
                    </Link>
                    <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md transition-all">
                        <span className="text-lg">📈</span>
                        <span className="font-semibold text-sm">Reports & Analytics</span>
                    </Link>
                    <Link to="/admin/balance" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
                        <span className="text-lg">💰</span>
                        <span className="font-semibold text-sm">Financial Overview</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2">
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <Link to="/admin/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Report</h1>
                        <p className="text-gray-500 text-sm mt-1">Detailed breakdown of clinic performance and growth.</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        {['Week', 'Month', 'Year'].map(p => (
                            <button key={p} onClick={() => setSelectedPeriod(p.toLowerCase())} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${selectedPeriod === p.toLowerCase() ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
                                <div className="text-sm text-green-600 font-medium">↑ 14.2% vs last period</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">Rs. 4.8M</div>
                                <div className="text-xs text-gray-500 font-medium uppercase">Total Revenue</div>
                            </div>
                        </div>
                        <div className="flex items-end justify-between h-64 gap-4 px-4">
                            {monthlyRevenue.map((m, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative group" style={{ height: m.h }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Rs. {m.rev}k
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-gray-500">{m.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Services</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Surgical Procedures', val: '42%', color: 'bg-blue-600' },
                                { label: 'Cosmetic Dentistry', val: '28%', color: 'bg-indigo-500' },
                                { label: 'General Checkups', val: '18%', color: 'bg-teal-500' },
                                { label: 'Orthodontics', val: '12%', color: 'bg-orange-400' }
                            ].map((s, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-600">{s.label}</span>
                                        <span className="text-xs font-bold text-gray-900">{s.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} rounded-full`} style={{ width: s.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                            View Service Details
                        </button>
                    </div>

                    {/* KPIs */}
                    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Patient Retention', val: '94.2%', icon: '🔄', change: '+2.1%', color: 'text-green-600' },
                            { label: 'Avg Case Value', val: 'Rs. 12k', icon: '💎', change: '+1.2k', color: 'text-blue-600' },
                            { label: 'New Patients', val: '18.4%', icon: '🚀', change: '+3.4%', color: 'text-purple-600' },
                            { label: 'Efficiency', val: '0.92', icon: '⚡', change: '+0.04', color: 'text-orange-600' }
                        ].map((k, i) => (
                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-2xl">{k.icon}</div>
                                    <div className={`text-xs font-bold ${k.color} bg-gray-50 px-2 py-1 rounded-full`}>{k.change}</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{k.val}</div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{k.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsAnalytics;
