import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffPatients = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [error, setError] = useState('');
    const [editModal, setEditModal] = useState({ show: false, patient: null });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/users/patients`, config);
                setPatients(data);
            } catch (err) {
                console.error('Error:', err);
                setError('Unable to load database. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();

        // Refresh patient list periodically
        const interval = setInterval(fetchPatients, 60000); // 1 minute
        return () => clearInterval(interval);
    }, [user.token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_BASE_URL}/api/users/${editModal.patient._id}`, {
                fullName: editModal.patient.fullName,
                email: editModal.patient.email,
                phone: editModal.patient.phone,
                age: editModal.patient.age,
                blocked: editModal.patient.blocked
            }, config);
            
            const updatedPatients = patients.map(p => 
                p._id === editModal.patient._id ? { ...p, ...editModal.patient } : p
            );
            setPatients(updatedPatients);
            setEditModal({ show: false, patient: null });
            alert('Patient record updated successfully.');
        } catch (err) {
            alert('Update failed. Permission denied.');
        } finally {
            setUpdating(false);
        }
    };

    const toggleBlock = async (patient) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const newStatus = !patient.blocked;
            await axios.put(`${API_BASE_URL}/api/users/${patient._id}`, { blocked: newStatus }, config);
            setPatients(patients.map(p => p._id === patient._id ? { ...p, blocked: newStatus } : p));
        } catch (err) {
            alert('Failed to update patient access.');
        }
    };

    const filteredPatients = patients.filter(patient => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            patient.fullName?.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term) ||
            patient.phone?.includes(term) ||
            patient.patientId?.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        if (activeFilter === 'Active') {
            return !patient.blocked && !patient.isDeleted;
        }

        if (activeFilter === 'Recent') {
            if (!patient.createdAt) return false;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return new Date(patient.createdAt) >= thirtyDaysAgo;
        }

        return true;
    });

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Accessing Directory...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-w-0">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1 flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none truncate">
                            Patient Records
                        </h1>
                        <p className="text-sm font-medium text-slate-500 max-w-md">
                            Manage demographics, contact info, and patient statuses.
                        </p>
                    </div>

                    <div className="flex shrink-0">
                        <button
                            onClick={() => navigate('/staff/book-appointment')}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 group flex items-center justify-center gap-3"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add New Patient
                        </button>
                    </div>
                </header>

                {/* Search & Filter - Modular Grid */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-sm min-w-0">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative min-w-0">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, ID, or phone..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex overflow-x-auto no-scrollbar gap-2 shrink-0 pb-1 lg:pb-0">
                            {['All', 'Active', 'Recent'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shrink-0 min-w-[100px] border ${activeFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-8 px-6 py-4 bg-red-50 border border-red-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-red-700 text-xs font-bold uppercase tracking-widest">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Error loading records
                        </div>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-700">
                            Reload
                        </button>
                    </div>
                )}

                {/* Patient Grid - Clean Card Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                        <div key={patient._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between h-full group">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-base border border-slate-200 shrink-0">
                                            {patient.fullName ? patient.fullName[0].toUpperCase() : 'P'}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">{patient.fullName}</h3>
                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">ID: {patient.patientId || 'NEW'}</div>
                                        </div>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${patient.blocked ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                        {patient.blocked ? 'Block' : 'Active'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        <span className="truncate">{patient.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        <span>{patient.phone || 'No phone provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 mt-auto">
                                <button
                                    onClick={() => navigate('/staff/book-appointment', { 
                                        state: { 
                                            patientId: patient._id, 
                                            fullName: patient.fullName,
                                            phone: patient.phone,
                                            email: patient.email,
                                            age: patient.age
                                        } 
                                    })}
                                    className="py-2 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all text-center border border-blue-100 shadow-sm"
                                >
                                    Book Visit
                                </button>
                                <button
                                    onClick={() => setEditModal({ show: true, patient: { ...patient } })}
                                    className="py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-center"
                                >
                                    Edit Info
                                </button>
                                <button
                                    onClick={() => toggleBlock(patient)}
                                    className={`col-span-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${patient.blocked ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'}`}
                                >
                                    {patient.blocked ? 'Unblock Patient' : 'Temporary Block'}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Zero Matches</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">No results found for "{searchTerm}".</p>
                            <button onClick={() => setSearchTerm('')} className="text-blue-600 font-bold hover:text-blue-800 text-xs uppercase tracking-widest">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </main>

            {/* Clean Edit Modal */}
            {editModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModal({ show: false, patient: null })}></div>
                    <form onSubmit={handleUpdate} className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Update Patient Record</h3>
                            <button type="button" onClick={() => setEditModal({ show: false, patient: null })} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editModal.patient.fullName}
                                    onChange={(e) => setEditModal({ ...editModal, patient: { ...editModal.patient, fullName: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editModal.patient.phone}
                                        onChange={(e) => setEditModal({ ...editModal, patient: { ...editModal.patient, phone: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age (Optional)</label>
                                    <input
                                        type="number"
                                        value={editModal.patient.age || ''}
                                        onChange={(e) => setEditModal({ ...editModal, patient: { ...editModal.patient, age: e.target.value } })}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={editModal.patient.email}
                                    onChange={(e) => setEditModal({ ...editModal, patient: { ...editModal.patient, email: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                    required
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                            <button type="button" onClick={() => setEditModal({ show: false, patient: null })} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 rounded-lg hover:bg-white transition-all">Cancel</button>
                            <button type="submit" disabled={updating} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50">
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StaffPatients;
