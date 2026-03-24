import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffAppointments = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};
    const navigate = useNavigate();

    // States
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        doctor: 'all',
        branch: 'all',
        status: 'all',
        paymentStatus: 'all',
        dateRange: { start: '', end: '' }
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Pagination & Sorting States
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 });

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Fetching appointments via my-appointments which handles staff/admin roles for "all" data
            const { data } = await axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config);
            setAppointments(data);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('Failed to load clinical schedules. Please check your connection and retry.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user.token) {
            navigate('/login');
            return;
        }
        
        fetchAppointments();

        // Enable real-time polling for staff to see new bookings
        const interval = setInterval(fetchAppointments, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user.token]);

    // Handle Search Debounce (Simulated with useMemo filtering)
    const filteredData = useMemo(() => {
        return appointments.filter(appt => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                (appt._id.toLowerCase().includes(term)) ||
                (appt.patient?.patientId?.toLowerCase().includes(term)) ||
                (appt.patient?.fullName?.toLowerCase().includes(term)) ||
                (appt.dentist?.fullName?.toLowerCase().includes(term));

            const matchesDoctor = filters.doctor === 'all' || appt.dentist?._id === filters.doctor;
            const matchesBranch = filters.branch === 'all' || appt.branch?._id === filters.branch;
            const matchesStatus = filters.status === 'all' || appt.status === filters.status;

            // Correctly derive payment status for booking fees
            const isPaid = appt.isFeePaid;
            const matchesPayment = filters.paymentStatus === 'all' ||
                (filters.paymentStatus === 'paid' && isPaid) ||
                (filters.paymentStatus === 'unpaid' && !isPaid);

            const apptDate = appt.date ? new Date(appt.date).toISOString().split('T')[0] : '';
            const matchesDate = (!filters.dateRange.start || apptDate >= filters.dateRange.start) &&
                (!filters.dateRange.end || apptDate <= filters.dateRange.end);

            return matchesSearch && matchesDoctor && matchesBranch && matchesStatus && matchesPayment && matchesDate;
        });
    }, [appointments, searchTerm, filters]);

    // Sorting Logic
    const sortedData = useMemo(() => {
        const data = [...filteredData];
        if (sortConfig.key) {
            data.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Nested fields
                if (sortConfig.key === 'patient') aValue = a.patient?.fullName;
                if (sortConfig.key === 'patient') bValue = b.patient?.fullName;
                if (sortConfig.key === 'dentist') aValue = a.dentist?.fullName;
                if (sortConfig.key === 'dentist') bValue = b.dentist?.fullName;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return data;
    }, [filteredData, sortConfig]);

    // Pagination Logic
    const paginatedData = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
        return sortedData.slice(startIndex, startIndex + pagination.pageSize);
    }, [sortedData, pagination]);

    const totalPages = Math.ceil(sortedData.length / pagination.pageSize);

    // Actions
    const handleStatusUpdate = async (id, newStatus) => {
        if (newStatus === 'cancelled' && !confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_BASE_URL}/api/appointments/${id}`, { status: newStatus }, config);
            fetchAppointments();
        } catch (err) {
            alert('Operation failed. Please try again.');
        }
    };

    // Derived unique doctors and branches for filters
    const doctors = useMemo(() => {
        const docs = appointments.map(a => a.dentist).filter(d => !!d);
        const unique = Array.from(new Set(docs.map(d => d._id))).map(id => docs.find(d => d._id === id));
        return unique;
    }, [appointments]);

    const branches = useMemo(() => {
        const brs = appointments.map(a => a.branch).filter(b => !!b);
        const unique = Array.from(new Set(brs.map(b => b._id))).map(id => brs.find(b => b._id === id));
        return unique;
    }, [appointments]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="space-y-0.5">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Appointment Master</h1>
                        <p className="text-sm text-gray-400 font-medium">Manage clinical schedules, patient bookings, and workflows.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={fetchAppointments}
                            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                            title="Refresh"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? 'animate-spin' : ''}>
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><polyline points="21 3 21 8 16 8" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/staff/book-appointment')}
                            className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 shrink-0"
                        >
                            + New Booking
                        </button>
                    </div>
                </div>

                {/* Filters Board */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
                    <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center">
                        {/* Instant Search */}
                        <div className="relative flex-1 w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Patient, ID, or Doctor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex items-center gap-2">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="all">Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <select
                                value={filters.doctor}
                                onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
                                className="px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer max-w-[150px]"
                            >
                                <option value="all">All Doctors</option>
                                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.fullName}</option>)}
                            </select>

                            <button
                                onClick={() => setFilters({ doctor: 'all', branch: 'all', status: 'all', paymentStatus: 'all', dateRange: { start: '', end: '' } })}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Reset"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            Advanced Filters
                        </button>
                    </div>
                </div>

                {loading ? (
                    /* Loading Skeleton Rows */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-6 border-b border-gray-50 animate-pulse flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-50 rounded w-1/3"></div>
                                </div>
                                <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="bg-white rounded-3xl border border-red-100 p-16 text-center shadow-lg">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">!</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Protocol Sync Error</h3>
                        <p className="text-gray-500 mb-8 font-medium">{error}</p>
                        <button onClick={fetchAppointments} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl">Re-establish Connection</button>
                    </div>
                ) : sortedData.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-3xl border border-gray-100 py-24 text-center shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📎</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">No Appointments Found</h3>
                        <p className="text-gray-500 font-medium mb-8">Adjust your filters or initiate a clinical record booking.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilters({ doctor: 'all', branch: 'all', status: 'all', paymentStatus: 'all', dateRange: { start: '', end: '' } }); }}
                            className="text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline"
                        >
                            Reset All Parameters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1100px]">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        {[
                                            { label: 'Reference', key: '_id' },
                                            { label: 'Patient Info', key: 'patient' },
                                            { label: 'Specialist', key: 'dentist' },
                                            { label: 'Unit', key: 'branch' },
                                            { label: 'Schedule', key: 'date' },
                                            { label: 'Status', key: 'status' },
                                            { label: 'Fee', key: 'paymentStatus' },
                                            { label: 'Actions', key: null },
                                        ].map((head) => (
                                            <th
                                                key={head.label}
                                                className={`px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${head.key ? 'cursor-pointer hover:text-gray-900 transition-colors' : ''}`}
                                                onClick={() => head.key && setSortConfig({ key: head.key, direction: sortConfig.key === head.key && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {head.label}
                                                    {head.key === sortConfig.key && (
                                                        <span className="text-blue-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedData.map((appt) => {
                                        const isPaid = appt.isFeePaid;
                                        return (
                                            <tr key={appt._id} className="hover:bg-[#FCFDFF] transition-colors group">
                                                <td className="px-5 py-3">
                                                    <div className="text-[11px] font-bold text-gray-900">REF-{appt._id.slice(-6).toUpperCase()}</div>
                                                    <div className="text-[9px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100/50 rounded px-1 mt-1 inline-block uppercase tracking-wider">{appt.patient?.patientId || 'NEW'}</div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-100">
                                                            {appt.patient?.fullName ? appt.patient.fullName[0].toUpperCase() : 'P'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-[13px] font-bold text-gray-900 truncate" title={appt.patient?.fullName}>{appt.patient?.fullName || 'Walk-in'}</div>
                                                            <div className="text-[10px] text-gray-400 font-medium truncate">{appt.patient?.email || 'No record'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="text-[13px] font-bold text-gray-700">Dr. {appt.dentist?.fullName?.split(' ').slice(-1)[0] || 'TBA'}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{appt.dentist?.specialization || 'General'}</div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                                        {appt.branch?.name || 'Main Hub'}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="text-[13px] font-bold text-gray-900">{new Date(appt.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                                                    <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5 border border-blue-100">{appt.time}</div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                appt.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    'bg-gray-100 text-gray-500 border-gray-200'
                                                        }`}>
                                                        {appt.status}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                                                        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{isPaid ? 'Success' : 'Due Fee'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/staff/appointments/${appt._id}`)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Details"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </button>
                                                        {appt.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                                                className="p-2 text-gray-400 hover:text-emerald-600 transition-colors" title="Confirm"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                            </button>
                                                        )}
                                                        {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                                className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Cancel"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card List View */}
                        <div className="md:hidden space-y-4">
                            {paginatedData.map((appt) => {
                                const isPaid = appt.isFeePaid;
                                return (
                                    <div key={appt._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm active:scale-[0.99] transition-transform">
                                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold border border-blue-100">
                                                    {appt.patient?.fullName ? appt.patient.fullName[0].toUpperCase() : 'P'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{appt.patient?.fullName || 'Walk-in'}</div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{appt.patient?.patientId || 'NEW RECORD'}</div>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                                    appt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                        'bg-gray-100 text-gray-500'
                                                }`}>
                                                {appt.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-4 mb-5">
                                            <div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Date & Time</div>
                                                <div className="text-xs font-bold text-gray-700">{new Date(appt.date).toLocaleDateString()} @ {appt.time}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Practitioner</div>
                                                <div className="text-xs font-bold text-gray-700">Dr. {appt.dentist?.fullName || 'TBA'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Clinical Unit</div>
                                                <div className="text-xs font-bold text-gray-700">{appt.branch?.name || 'Main Branch'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Financial State</div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                                                    <div className="text-xs font-bold text-gray-700">{isPaid ? 'Paid' : 'Unpaid'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/staff/appointments/${appt._id}`)}
                                                className="flex-1 py-3 bg-gray-50 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                                            >
                                                View Ledger
                                            </button>
                                            {appt.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                                                >
                                                    Confirm Hub
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Bar */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rows Per Page</span>
                                <select
                                    value={pagination.pageSize}
                                    onChange={(e) => setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value), currentPage: 1 }))}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={pagination.currentPage === 1}
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                    className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <div className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-[0.3em] shadow-sm">
                                    {pagination.currentPage} / {totalPages || 1}
                                </div>
                                <button
                                    disabled={pagination.currentPage === totalPages || totalPages === 0}
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                    className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Mobile Filters Drawer Overlay */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)}>
                    <div className="bg-white rounded-t-[2.5rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Filter Parameters</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">✕</button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Appointment Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                                >
                                    <option value="all">Every State</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Practitioner</label>
                                <select
                                    value={filters.doctor}
                                    onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                                >
                                    <option value="all">All Specialists</option>
                                    {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.fullName}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Financial State</label>
                                <select
                                    value={filters.paymentStatus}
                                    onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                                >
                                    <option value="all">Any Status</option>
                                    <option value="paid">Settled</option>
                                    <option value="unpaid">Outstanding</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl"
                        >
                            Apply Parameters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAppointments;
