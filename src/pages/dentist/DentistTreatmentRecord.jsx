import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const DentistTreatmentRecord = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const location = useLocation();

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [treatments, setTreatments] = useState([]);

    const formatLastVisit = (dateString) => {
        if (!dateString) return 'No previous visits';
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(location.state?.searchName || '');
    const [showModal, setShowModal] = useState(false);
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(localStorage.getItem('selectedDentistId') || user?._id || '');
    const [newRecord, setNewRecord] = useState({ title: '', procedures: '', notes: '', prescriptions: '', cost: '', attachmentUrl: '' });

    useEffect(() => {
        if (selectedDentist) localStorage.setItem('selectedDentistId', selectedDentist);
    }, [selectedDentist]);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/users/dentists`);
                setDentists(data);
                if (user.role !== 'dentist' && !selectedDentist && data.length > 0) {
                    setSelectedDentist(data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching dentists:', error);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            setError(null);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/users/patients`, config);
                setPatients(data);

                if (location.state?.patientId) {
                    const found = data.find(p => p._id === location.state.patientId);
                    if (found) {
                        setSelectedPatient(found);
                        if (location.state.startVisit) setShowModal(true);
                    }
                }
            } catch (error) {
                console.error('Fetch Patients Error:', error);
                setError('Failed to load patient registry. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [user.token, location.state]);

    useEffect(() => {
        if (!selectedPatient) return;
        const fetchTreatments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/treatments/patient/${selectedPatient._id}`, config);
                setTreatments(data);
            } catch (error) {
                console.error('Fetch Treatments Error:', error);
            }
        };
        fetchTreatments();
    }, [selectedPatient, user.token]);

    const handleSaveRecord = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                patientId: selectedPatient._id,
                dentistId: selectedDentist,
                ...newRecord,
                procedures: newRecord.procedures.split(',').map(p => p.trim()),
                cost: Number(newRecord.cost) || 0,
                attachments: newRecord.attachmentUrl ? [{ name: 'Medical Scan', url: newRecord.attachmentUrl, type: 'scan' }] : []
            };
            const { data } = await axios.post(`${API_BASE_URL}/api/treatments`, payload, config);
            setTreatments([data, ...treatments]);
            setShowModal(false);
            setNewRecord({ title: '', procedures: '', notes: '', prescriptions: '', cost: '', attachmentUrl: '' });
            alert('Dental record saved successfully');
        } catch (error) {
            console.error('Save Record Error:', error);
            alert('Failed to save dental record');
        }
    };

    const filteredPatients = patients.filter(p =>
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="mb-8 flex flex-col xl:flex-row justify-between xl:items-end gap-6">
                    <div className="space-y-2">
                        {selectedPatient ? (
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                                Back to Patients
                            </button>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-100 text-xs font-semibold">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                Doctor Portal
                            </div>
                        )}
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {selectedPatient ? 'Dental Records' : 'Treatment Registry'}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                            {selectedPatient ? `Comprehensive treatment history for ${selectedPatient.fullName}` : 'Search patients and manage their clinical treatment history.'}
                        </p>
                    </div>

                    {!selectedPatient && (
                        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-stretch sm:items-center">
                            {dentists.length > 1 && (
                                <div className="relative">
                                    <select
                                        value={selectedDentist}
                                        onChange={(e) => setSelectedDentist(e.target.value)}
                                        className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
                                    >
                                        {dentists.map(d => (
                                            <option key={d._id} value={d._id}>View as: Dr. {d.fullName.split(' ').pop()}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                    </span>
                                </div>
                            )}
                            <div className="relative flex-1 xl:w-[300px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {!selectedPatient ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {error && (
                            <div className="col-span-full mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
                                <span className="text-xl">⚠️</span>
                                <p className="text-sm font-bold">{error}</p>
                                <button onClick={() => window.location.reload()} className="ml-auto text-xs font-extrabold uppercase bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">Retry</button>
                            </div>
                        )}
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-10 bg-gray-50 rounded-lg"></div>
                                </div>
                            ))
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map(p => (
                                <div key={p._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl border border-blue-100">
                                                {p.fullName[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 truncate">{p.fullName}</h3>
                                                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">ID: {p.patientId || 'Pending'}</div>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-gray-400">STATUS</span>
                                            <span className="text-gray-900 uppercase">Active Patient</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-gray-400">LAST VISIT</span>
                                            <span className="text-gray-900">{formatLastVisit(p.lastVisit)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedPatient(p)}
                                        className="w-full py-2.5 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-colors border border-gray-200 hover:border-blue-600"
                                    >
                                        Open Dental Records
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-lg font-bold text-gray-500">No patients found matches "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Profile & History */}
                        <aside className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl mb-4 border border-blue-100">
                                        {selectedPatient.fullName[0]}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedPatient.fullName}</h2>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">ID: {selectedPatient.patientId || 'Pending'}</p>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400 uppercase">Emergency</span>
                                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Allergy: Penicillin</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-400 uppercase">Blood Group</span>
                                        <span className="text-xs font-bold text-gray-900">B+ Positive</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full mt-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Add New Record
                                </button>
                            </div>

                            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Follow-up Notes</h3>
                                    <p className="text-sm font-medium leading-relaxed opacity-90">
                                        Patient is recovering well from previous procedure. Monitor sensitivity during next visit.
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                        <span className="text-[10px] font-bold">Post-Op Stabilization</span>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
                            </div>
                        </aside>

                        {/* History Table */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-bold text-gray-900">Treatment History</h2>
                                        <p className="text-xs text-gray-500 font-medium">Historical logs and clinical procedure data</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2.5 py-1 rounded border border-gray-100">{treatments.length} Records</span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {treatments.length > 0 ? (
                                        treatments.map((t) => (
                                            <div key={t._id} className="p-6 sm:p-8 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                                            {new Date(t.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <h4 className="text-xl font-bold text-gray-900">{t.title}</h4>
                                                    </div>
                                                    <div className="flex flex-col sm:items-end gap-2">
                                                        <div className="text-lg font-bold text-gray-900">Rs. {t.cost.toLocaleString()}</div>
                                                        {t.paid ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100">Paid</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-100">Pending Receipt</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {t.procedures.map((p, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium italic border-l-4 border-blue-600 mb-4">
                                                    "{t.notes}"
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {t.prescriptions && (
                                                        <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center text-sm">💊</div>
                                                            <div className="min-w-0">
                                                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prescriptions</div>
                                                                <div className="text-xs font-bold text-gray-900 truncate">{t.prescriptions}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {t.attachments && t.attachments.length > 0 && (
                                                        <a href={t.attachments[0].url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 border border-gray-900 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors">
                                                            <span>📄</span> View Medical Scan
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-24 text-center">
                                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-2xl">📂</div>
                                            <h3 className="font-bold text-gray-900">No records found</h3>
                                            <p className="text-sm text-gray-500 mt-1">This patient has no treatment history recorded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* New Record Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">New Treatment Record</h3>
                                <p className="text-sm text-gray-500 mt-1">Adding entry for {selectedPatient?.fullName}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSaveRecord} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Treatment Title <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required value={newRecord.title}
                                            onChange={e => setNewRecord({ ...newRecord, title: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                            placeholder="e.g. Scaling & Polishing"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">Cost (Rs.) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number" required value={newRecord.cost}
                                            onChange={e => setNewRecord({ ...newRecord, cost: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Procedures <span className="text-gray-400 font-normal">(comma separated)</span></label>
                                    <input
                                        type="text" value={newRecord.procedures}
                                        onChange={e => setNewRecord({ ...newRecord, procedures: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="Scaling, Polishing, Fluoride Application"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Clinical Notes <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={4} required value={newRecord.notes}
                                        onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                                        placeholder="Enter detailed treatment observations..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Prescriptions</label>
                                    <input
                                        type="text" value={newRecord.prescriptions}
                                        onChange={e => setNewRecord({ ...newRecord, prescriptions: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="Paracetamol 500mg, etc."
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors"
                                    >
                                        Save Dental Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DentistTreatmentRecord;
