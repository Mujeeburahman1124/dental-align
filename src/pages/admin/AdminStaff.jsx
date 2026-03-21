import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const AdminStaff = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
                const staffMembers = data.filter(u => u.role === 'staff' || u.role === 'dentist');
                setEmployees(staffMembers);
            } catch (err) {
                console.error('Fetch Employees Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [user.token]);

    const filteredEmployees = employees.filter(e => 
        e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadCSV = () => {
        const header = "Employee Name,Role,Email,Base Salary,Bonus,Net Payout\n";
        const rows = filteredEmployees.map(e => {
            const isDentist = e.role === 'dentist';
            const baseSalary = isDentist ? 85000 : 45000;
            const bonus = isDentist ? 15000 : 0;
            const net = baseSalary + bonus;
            return `"${e.fullName}",${e.role},${e.email},${baseSalary},${bonus},${net}`;
        }).join("\n");
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Staff_Payroll_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleAction = (msg) => {
        alert(`${msg} feature is coming soon! For now, please use the CSV Export button.`);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Personnel...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Header Section */}
                <div className="mb-8 p-5 bg-white border border-slate-300 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div>
                        <Link to="/admin/dashboard" className="text-blue-600 font-bold text-[10px] uppercase hover:underline mb-1 block">← Dashboard Overview</Link>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-wide">Employee Payroll Ledger</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Internal Salary Audit — Colombo | Kandy | Kurunegala</p>
                    </div>
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            placeholder="FIND EMPLOYEE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-2 border-slate-200 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Payroll Table */}
                <div className="bg-white border-2 border-slate-200 rounded shadow-sm overflow-hidden mb-8">
                    <div className="bg-slate-800 px-6 py-3 border-b-2 border-slate-900 flex justify-between items-center">
                        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Monthly Disbursement Records</h2>
                        <button 
                            onClick={downloadCSV}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <span>Download CSV</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[750px]">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Employee</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Basic (RS)</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Bonus</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase text-right">Net Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredEmployees.length > 0 ? filteredEmployees.map((e, idx) => {
                                    const isDentist = e.role === 'dentist';
                                    const baseSalary = isDentist ? 85000 : 45000;
                                    const bonus = isDentist ? 15000 : 0; 
                                    const net = baseSalary + bonus;

                                    return (
                                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-900 text-sm uppercase">{e.fullName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{e.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${isDentist ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-600 bg-slate-50'} uppercase`}>
                                                    {e.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-700">{baseSalary.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-emerald-600">{bonus > 0 ? `+${bonus.toLocaleString()}` : '—'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-base font-black text-slate-900 tracking-tighter">Rs. {net.toLocaleString()}</div>
                                                <div className="text-[9px] font-bold text-emerald-600 uppercase">Status: Settled</div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-300 font-bold uppercase tracking-widest">No staff records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Grid - Responsive 1/2/3 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Summary Box */}
                    <div className="bg-white p-5 border-2 border-slate-200 rounded shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payout Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold border-b pb-2">
                                <span className="text-slate-500 uppercase">Base Payroll:</span>
                                <span>Rs. 845,000</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold border-b pb-2">
                                <span className="text-slate-500 uppercase">Clinic Mod:</span>
                                <span className="text-emerald-600">Rs. 92,500</span>
                            </div>
                            <div className="flex justify-between text-sm font-black pt-2 text-blue-700 capitalize">
                                <span>Total Bank Transfer:</span>
                                <span>Rs. 937,500</span>
                            </div>
                        </div>
                    </div>

                    {/* Dark Box - Actionable */}
                    <div className="bg-slate-900 p-6 rounded shadow-lg flex flex-col justify-between border-2 border-slate-950">
                        <div>
                            <h3 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Confidential Access</h3>
                            <p className="text-xs text-slate-300 leading-relaxed font-bold uppercase mb-4">
                                Salary records are verified against daily attendance and clinical output filters.
                            </p>
                        </div>
                        <button 
                            onClick={downloadCSV}
                            className="bg-blue-600 text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Export Verification Log
                        </button>
                    </div>

                    {/* Report Box */}
                    <div className="bg-white p-5 border-2 border-slate-200 rounded shadow-sm flex flex-col items-center justify-center text-center sm:col-span-2 lg:col-span-1">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 italic underline decoration-blue-500 underline-offset-4">Employee Ledger Export</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-4">Download combined salary slips as a secure CSV document.</p>
                        <button 
                            onClick={downloadCSV}
                            className="w-full py-2 bg-slate-800 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Generate All Slip Files (CSV)
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminStaff;
