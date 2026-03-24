import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Standard "student-build" color palette - clean, clear, no marketing fluff
const CHART_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777'];

const ReportsAnalytics = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin' };
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('month'); 
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            try {
                // Parallel fetch for clinical speed
                const [treatData, branchData] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/treatments/all`, config),
                    axios.get(`${API_BASE_URL}/api/branches`, config)
                ]);
                
                setTreatments(treatData.data);
                
                // If branches are empty, use unique branches found in treatments to ensure Kandy/Kurunegala show up.
                const dbBranches = branchData.data || [];
                if (dbBranches.length === 0) {
                    const unique = [...new Set(treatData.data.map(t => t.branch?.name || t.branch).filter(Boolean))];
                    setBranches(unique.map(b => ({ _id: b, name: b })));
                } else {
                    setBranches(dbBranches);
                }

            } catch (err) {
                console.error('Data Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [user.token]);

    // Simplified filtering logic for consistent student build
    const filteredData = useMemo(() => {
        let results = treatments;
        
        // Date filtering based on period
        const now = new Date();
        if (selectedPeriod === 'month') {
            results = results.filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear());
        } else if (selectedPeriod === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            results = results.filter(t => new Date(t.date) >= oneWeekAgo);
        } else if (selectedPeriod === '3month') {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            results = results.filter(t => new Date(t.date) >= threeMonthsAgo);
        } else if (selectedPeriod === '6month') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            results = results.filter(t => new Date(t.date) >= sixMonthsAgo);
        } else if (selectedPeriod === 'year') {
            results = results.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        }

        // Branch filtering
        if (selectedBranch !== 'All') {
            results = results.filter(t => {
                const branchId = t.branch?._id || t.branch;
                const branchName = t.branch?.name;
                return branchId === selectedBranch || branchName === selectedBranch;
            });
        }
        return results;
    }, [treatments, selectedPeriod, selectedBranch]);

    // Chart Data computations
    const revenueTimelineData = useMemo(() => {
        const data = [];
        const now = new Date();
        
        if (selectedPeriod === 'year') {
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach((m, i) => {
                const total = filteredData.filter(t => new Date(t.date).getMonth() === i).reduce((acc, t) => acc + (t.cost || 0), 0);
                data.push({ name: m, revenue: total });
            });
        } else if (selectedPeriod === '6month' || selectedPeriod === '3month') {
            const monthsToBack = selectedPeriod === '6month' ? 6 : 3;
            for (let i = monthsToBack - 1; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const mStr = d.toLocaleString('default', { month: 'short' });
                const total = filteredData.filter(t => new Date(t.date).getMonth() === d.getMonth() && new Date(t.date).getFullYear() === d.getFullYear()).reduce((acc, t) => acc + (t.cost || 0), 0);
                data.push({ name: mStr, revenue: total });
            }
        } else if (selectedPeriod === 'month') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                const total = filteredData.filter(t => new Date(t.date).getDate() === i).reduce((acc, t) => acc + (t.cost || 0), 0);
                data.push({ name: `${i}`, revenue: total });
            }
        } else {
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d, i) => {
                const total = filteredData.filter(t => new Date(t.date).getDay() === i).reduce((acc, t) => acc + (t.cost || 0), 0);
                data.push({ name: d, revenue: total });
            });
        }
        return data;
    }, [filteredData, selectedPeriod]);

    const serviceDistributionData = useMemo(() => {
        const counts = {};
        filteredData.forEach(t => {
            const label = t.title || 'General';
            counts[label] = (counts[label] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredData]);

    const branchComparisonData = useMemo(() => {
        const map = {};
        // Use all treatments for this chart to compare ALL branches
        treatments.forEach(t => {
            const bName = t.branch?.name || t.branch || 'Colombo Elite'; // default fallback for unassigned
            map[bName] = (map[bName] || 0) + (t.cost || 0);
        });
        return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
    }, [treatments]);

    const downloadCSV = () => {
        const header = "Date,Patient,Service,Branch,Cost,Status\n";
        const rows = filteredData.map(t => 
            `${new Date(t.date).toLocaleDateString()},${t.patient?.fullName || 'Walk-in'},${t.title},${t.branch?.name || t.branch || 'Main'},${t.cost},${t.paid ? 'Paid' : 'Unpaid'}`
        ).join("\n");
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Dental_Align_Report_${selectedPeriod}.csv`;
        a.click();
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">LOADING DATA...</div>;

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-100/30 min-h-screen text-slate-800">
            <Navbar />

            <div className="max-w-screen-xl mx-auto px-4 py-8">
                {/* Clean Header */}
                <div className="mb-8 p-6 bg-white border border-slate-300 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link to="/admin/dashboard" className="text-blue-600 font-bold text-xs uppercase hover:underline mb-2 block">← Dashboard Overview</Link>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Reports & Analytical Hub</h1>
                        <p className="text-sm text-slate-500 font-medium">Detailed breakdown for Colombo, Kandy, and Kurunegala branches.</p>
                    </div>
                    <button onClick={downloadCSV} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all">
                        Download CSV Report
                    </button>
                </div>

                {/* Filters - Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-4 border border-slate-300 rounded-lg shadow-sm">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time Period</label>
                        <select 
                            value={selectedPeriod} 
                            onChange={e => setSelectedPeriod(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-sm font-bold uppercase outline-none focus:border-blue-500 rounded"
                        >
                            <option value="week">Past 7 Days</option>
                            <option value="month">Current Month</option>
                            <option value="3month">Past 3 Months</option>
                            <option value="6month">Past 6 Months</option>
                            <option value="year">Current Year</option>
                        </select>
                    </div>
                    <div className="bg-white p-4 border border-slate-300 rounded-lg shadow-sm">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Selected Clinic Location</label>
                        <select 
                            value={selectedBranch} 
                            onChange={e => setSelectedBranch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 text-sm font-bold uppercase outline-none focus:border-blue-500 rounded"
                        >
                            <option value="All">All Locations Combined</option>
                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Calculated Yield', value: 'Rs. ' + filteredData.reduce((acc, t) => acc + (t.cost || 0), 0).toLocaleString(), color: 'text-blue-600' },
                        { label: 'Procedures Done', value: filteredData.length, color: 'text-slate-900' },
                        { label: 'Settled Income', value: 'Rs. ' + filteredData.filter(t => t.paid).reduce((acc, t) => acc + (t.cost || 0), 0).toLocaleString(), color: 'text-emerald-700' },
                        { label: 'Total Patient Dues', value: 'Rs. ' + filteredData.filter(t => !t.paid).reduce((acc, t) => acc + (t.cost || 0), 0).toLocaleString(), color: 'text-red-600' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white p-5 border border-slate-300 rounded-lg shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Charts - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Over Time */}
                    <div className="bg-white p-6 border border-slate-300 rounded-lg shadow-sm min-h-[350px] flex flex-col">
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b pb-3">Revenue Collection Performance</h3>
                        <div className="flex-1 w-full mt-auto">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={revenueTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={v => `LKR ${v/1000}k`} />
                                    <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 700, borderRadius: '4px' }} cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="revenue" fill="#2563eb" barSize={selectedPeriod === 'month' ? 8 : 30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Service Breakdown */}
                    <div className="bg-white p-6 border border-slate-300 rounded-lg shadow-sm min-h-[350px] flex flex-col">
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b pb-3">Treatment Portfolio Breakdown</h3>
                        <div className="flex-1 w-full mt-auto">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie 
                                        data={serviceDistributionData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {serviceDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 700, borderRadius: '4px' }} />
                                    <Legend align="right" verticalAlign="middle" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Branch Comparison */}
                    <div className="bg-white p-6 border border-slate-300 rounded-lg shadow-sm min-h-[350px] flex flex-col">
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b pb-3">Branch Comparison View</h3>
                        <div className="flex-1 w-full mt-auto">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={branchComparisonData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} width={100} />
                                    <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 700, borderRadius: '4px' }} />
                                    <Bar dataKey="revenue" fill="#16a34a" barSize={16} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Comparing Colombo, Kandy, and Kurunegala performance metrics.</p>
                    </div>

                    {/* Operational Velocity (Area) */}
                    <div className="bg-white p-6 border border-slate-300 rounded-lg shadow-sm min-h-[350px] flex flex-col">
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b pb-3">Clinical Treatment Velocity</h3>
                        <div className="flex-1 w-full mt-auto">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={revenueTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 700, borderRadius: '4px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Treatment List Table */}
                <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-300">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Procedural Transaction History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-5 py-3 border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Date</th>
                                    <th className="px-5 py-3 border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                                    <th className="px-5 py-3 border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Location</th>
                                    <th className="px-5 py-3 border-b text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Individual Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.slice(0, 50).map((t, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3 border-b text-xs font-medium text-slate-600 italic">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-5 py-3 border-b">
                                            <div className="font-bold text-slate-800">{t.patient?.fullName || 'Walk-in'}</div>
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t.title}</div>
                                        </td>
                                        <td className="px-5 py-3 border-b">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.branch?.name || t.branch || 'Colombo'}</span>
                                        </td>
                                        <td className="px-5 py-3 border-b text-right font-black text-slate-900">
                                            Rs. {t.cost?.toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic">No clinical records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
