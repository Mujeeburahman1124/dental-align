import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ReportsAnalytics = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin User' };
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    // Dynamic data based on selected period
    const getChartData = () => {
        switch (selectedPeriod) {
            case 'week':
                return [
                    { label: 'Mon', rev: 12, h: '40%' },
                    { label: 'Tue', rev: 18, h: '60%' },
                    { label: 'Wed', rev: 15, h: '50%' },
                    { label: 'Thu', rev: 22, h: '75%' },
                    { label: 'Fri', rev: 28, h: '90%' },
                    { label: 'Sat', rev: 32, h: '95%' },
                    { label: 'Sun', rev: 10, h: '35%' }
                ];
            case 'year':
                return [
                    { label: 'Jan', rev: 380, h: '60%' },
                    { label: 'Feb', rev: 420, h: '70%' },
                    { label: 'Mar', rev: 395, h: '65%' },
                    { label: 'Apr', rev: 450, h: '80%' },
                    { label: 'May', rev: 480, h: '90%' },
                    { label: 'Jun', rev: 485, h: '95%' },
                    { label: 'Jul', rev: 460, h: '85%' },
                    { label: 'Aug', rev: 430, h: '75%' },
                    { label: 'Sep', rev: 490, h: '92%' },
                    { label: 'Oct', rev: 510, h: '96%' },
                    { label: 'Nov', rev: 470, h: '88%' },
                    { label: 'Dec', rev: 520, h: '98%' }
                ];
            case 'month':
            default:
                return [
                    { label: 'Week 1', rev: 95, h: '65%' },
                    { label: 'Week 2', rev: 110, h: '75%' },
                    { label: 'Week 3', rev: 105, h: '70%' },
                    { label: 'Week 4', rev: 125, h: '85%' }
                ];
        }
    };

    const chartData = getChartData();
    const periodTotals = { week: 'Rs. 137k', month: 'Rs. 435k', year: 'Rs. 5.5M' };
    const periodGrowth = { week: '↑ 8.4%', month: '↑ 14.2%', year: '↑ 22.5%' };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

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
                    {/* Revenue Chart - SVG Bar Chart */}
                    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
                                <div className="text-sm text-green-600 font-medium">{periodGrowth[selectedPeriod]} vs last period</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{periodTotals[selectedPeriod]}</div>
                                <div className="text-xs text-gray-500 font-medium uppercase">Total Revenue</div>
                            </div>
                        </div>

                        {/* Custom SVG Bar Chart */}
                        <div className="h-64 w-full">
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                                {/* Y-axis lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <line
                                        key={i}
                                        x1="0"
                                        y1={i * 10}
                                        x2="100"
                                        y2={i * 10}
                                        stroke="#f3f4f6"
                                        strokeWidth="0.5"
                                    />
                                ))}

                                {/* Bars */}
                                {chartData.map((d, i) => {
                                    const barHeight = parseFloat(d.h) / 2; // Scale down for 50 height
                                    const barWidth = 6;
                                    // Calculate x position based on count to center them
                                    const x = (i * (100 / chartData.length)) + (100 / chartData.length / 2) - (barWidth / 2);

                                    return (
                                        <g key={i} className="group cursor-pointer">
                                            <rect
                                                x={x}
                                                y={50 - barHeight}
                                                width={barWidth}
                                                height={barHeight}
                                                rx="1"
                                                className="fill-indigo-500 hover:fill-indigo-600 transition-all duration-300"
                                            />
                                            {/* Tooltip */}
                                            <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <rect
                                                    x={x - 4}
                                                    y={50 - barHeight - 8}
                                                    width="14"
                                                    height="6"
                                                    rx="1"
                                                    fill="#1f2937"
                                                />
                                                <text
                                                    x={x + 3}
                                                    y={50 - barHeight - 4}
                                                    fontSize="3"
                                                    fill="white"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    {d.rev}k
                                                </text>
                                            </g>
                                            <text
                                                x={x + 3}
                                                y="55"
                                                fontSize="3"
                                                fill="#6b7280"
                                                textAnchor="middle"
                                                className="font-medium"
                                            >
                                                {d.label}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Services - SVG Pie Chart */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Services</h3>

                        <div className="flex-1 flex items-center justify-center relative">
                            {/* Simple Pie Chart using conic-gradient */}
                            <div className="w-48 h-48 rounded-full relative"
                                style={{
                                    background: `conic-gradient(
                                        #4f46e5 0% 42%, 
                                        #6366f1 42% 70%, 
                                        #14b8a6 70% 88%, 
                                        #f97316 88% 100%
                                    )`
                                }}
                            >
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                    <span className="text-2xl font-bold text-gray-900">{chartData.length * 12}</span>
                                    <span className="text-xs text-gray-500 uppercase font-bold">Procedures</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            {[
                                { label: 'Surgical Procedures', val: '42%', color: 'bg-indigo-600' },
                                { label: 'Cosmetic Dentistry', val: '28%', color: 'bg-indigo-500' },
                                { label: 'General Checkups', val: '18%', color: 'bg-teal-500' },
                                { label: 'Orthodontics', val: '12%', color: 'bg-orange-500' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                                        <span className="text-gray-600 font-medium">{s.label}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{s.val}</span>
                                </div>
                            ))}
                        </div>
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
