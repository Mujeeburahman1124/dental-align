import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DentistTreatmentRecord = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const location = useLocation();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ title: '', procedures: '', notes: '', prescriptions: '', cost: '', attachmentUrl: '' });
    const [showPaymentModal, setShowPaymentModal] = useState({ show: false, treatmentId: null, amount: 0, title: '' });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/patients', config);
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
            }
        };
        fetchPatients();
    }, [user.token, location.state]);

    useEffect(() => {
        if (!selectedPatient) return;
        const fetchTreatments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/treatments/patient/${selectedPatient._id}`, config);
                setTreatments(data);
            } catch (error) {
                console.error('Fetch Treatments Error:', error);
            }
        };
        fetchTreatments();
    }, [selectedPatient, user.token]);

    const handleSaveRecord = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                patientId: selectedPatient._id,
                ...newRecord,
                procedures: newRecord.procedures.split(',').map(p => p.trim()),
                cost: Number(newRecord.cost) || 0,
                attachments: newRecord.attachmentUrl ? [{ name: 'X-Ray Scan', url: newRecord.attachmentUrl, type: 'xray' }] : []
            };
            const { data } = await axios.post('http://localhost:5000/api/treatments', payload, config);
            setTreatments([data, ...treatments]);
            setShowModal(false);
            setNewRecord({ title: '', procedures: '', notes: '', prescriptions: '', cost: '', attachmentUrl: '' });
        } catch (error) {
            console.error('Save Record Error:', error);
            alert('Failed to save clinical data');
        }
    };

    const handlePayment = async (method) => {
        // Optimistic update for demo purposes since backend route might be waiting
        // In real app: await axios.put(`/api/treatments/${showPaymentModal.treatmentId}/pay`, { method })
        const updatedTreatments = treatments.map(t =>
            t._id === showPaymentModal.treatmentId ? { ...t, paid: true, paymentMethod: method } : t
        );
        setTreatments(updatedTreatments);
        setShowPaymentModal({ show: false, treatmentId: null, amount: 0, title: '' });
        alert(`Payment of Rs. ${showPaymentModal.amount} settled via ${method}`);
    };

    const SidebarItem = ({ to, icon, label, active = false }) => (
        <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
            <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className="font-bold text-sm tracking-tight">{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex font-inter">
            {/* Sidebar */}
            <aside className="w-[300px] bg-white border-r border-gray-100 flex flex-col p-8 fixed h-full z-20">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">D</div>
                    <span className="text-2xl font-black text-[#111827] tracking-tighter">DentAlign</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/dentist/dashboard" icon="🩺" label="Surgical Console" />
                    <SidebarItem to="/dentist/records" icon="📋" label="Patient Ecosystem" active />
                    <SidebarItem to="/dentist/prescriptions" icon="💊" label="RX Manager" />
                    <SidebarItem to="/dentist/calendar" icon="🗓️" label="Clinical Roadmap" />
                    <SidebarItem to="/dentist/settings" icon="⚙️" label="My Profile" />
                </nav>

                <div className="mt-auto p-6 bg-gray-50 rounded-[40px]">
                    <button onClick={handleLogout} className="w-full bg-white border border-gray-200 py-3 rounded-xl font-bold text-xs text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">End Session</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[300px] p-12 overflow-y-auto h-screen custom-scrollbar">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Ecosystem</h1>
                    <p className="text-gray-500 font-medium mt-1">Detailed clinical investigation and transaction management</p>
                </header>

                {!selectedPatient ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="relative mb-8 group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                            <input
                                type="text"
                                placeholder="Search for patients by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 py-4 pl-12 pr-6 rounded-xl shadow-sm text-base outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {patients.filter(p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                <button key={p._id} onClick={() => setSelectedPatient(p)} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {p.fullName[0]}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 mb-1">{p.fullName}</div>
                                        <div className="text-xs text-gray-500 font-medium mb-2">ID: {p._id.slice(-6).toUpperCase()}</div>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wider">Active</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-8">
                        {/* Patient Header */}
                        <div className="col-span-12 flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-6">
                                <button onClick={() => setSelectedPatient(null)} className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all">←</button>
                                <div>
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Investigation Profile</div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.fullName}</h2>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                                <span>📝</span> Initialize Record
                            </button>
                        </div>

                        {/* Left Column: Vitals */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Patient Vitals</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">⚠️</span>
                                            <span className="text-xs font-bold text-red-700 uppercase">Allergies</span>
                                        </div>
                                        <span className="text-xs font-bold text-red-700">Penicillin</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">🩸</span>
                                            <span className="text-xs font-bold text-blue-700 uppercase">Blood Type</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-700">B+ Positive</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-lg">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Upcoming Schedule</h3>
                                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                                    <div className="text-xs font-bold text-blue-400 uppercase mb-1">Follow-up</div>
                                    <div className="text-base font-bold text-white">Post-Op Checkup</div>
                                    <div className="text-xs text-gray-400 mt-2">ETA: 4 Days</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Treatment History */}
                        <div className="col-span-12 lg:col-span-8">
                            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="text-lg font-bold text-gray-900">Treatment History</h2>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{treatments.length} Records</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {treatments.length > 0 ? treatments.map(t => (
                                        <div key={t._id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-xs font-bold text-blue-600 mb-1">{new Date(t.date).toLocaleDateString()}</div>
                                                    <h4 className="text-xl font-bold text-gray-900">{t.title}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">Rs. {t.cost.toLocaleString()}</div>
                                                    {t.paid ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wide border border-green-100">
                                                            <span>✓</span> Paid
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setShowPaymentModal({ show: true, treatmentId: t._id, amount: t.cost, title: t.title })}
                                                            className="mt-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors shadow-sm"
                                                        >
                                                            Process Payment
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {t.procedures.map((p, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">{p}</span>
                                                ))}
                                            </div>

                                            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{t.notes}"</p>

                                            {t.prescriptions && (
                                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 text-orange-800">
                                                    <span className="text-lg">💊</span>
                                                    <div>
                                                        <div className="text-xs font-bold uppercase tracking-wide text-orange-500 mb-1">Prescription</div>
                                                        <div className="text-sm font-medium">{t.prescriptions}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {t.attachments && t.attachments.length > 0 && (
                                                <div className="mt-4">
                                                    <a href={t.attachments[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-md">
                                                        <span>📷</span> View X-Ray Scan
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="p-12 text-center text-gray-400">
                                            <div className="text-4xl mb-4 opacity-20">📂</div>
                                            <div className="font-semibold text-sm">No clinical records found</div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </main>

            {/* Payment Modal */}
            {showPaymentModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 text-2xl">💰</div>
                            <h3 className="text-xl font-bold text-gray-900">Settle Payment</h3>
                            <p className="text-sm text-gray-500 mt-1">{showPaymentModal.title}</p>
                            <div className="text-2xl font-black text-gray-900 mt-2">Rs. {parseInt(showPaymentModal.amount).toLocaleString()}</div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handlePayment('Cash')}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <span className="font-bold text-gray-700 group-hover:text-green-700">💵 Cash Payment</span>
                                <span className="text-gray-400 group-hover:text-green-600">→</span>
                            </button>
                            <button
                                onClick={() => handlePayment('Online Transfer')}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <span className="font-bold text-gray-700 group-hover:text-blue-700">🏦 Online Transfer</span>
                                <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPaymentModal({ show: false, treatmentId: null, amount: 0, title: '' })}
                            className="w-full mt-6 py-2.5 text-gray-500 font-bold text-sm hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Surgical Entry Modal */}
            {/* Surgical Entry Modal - Compact Version */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Clinical Entry</h3>
                                <p className="text-xs text-gray-500">Record procedures for {selectedPatient?.fullName}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Treatment Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Root Canal"
                                        value={newRecord.title}
                                        onChange={e => setNewRecord({ ...newRecord, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Cost (Rs.)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newRecord.cost}
                                        onChange={e => setNewRecord({ ...newRecord, cost: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Procedures (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Scaling, Polishing, Fluoride"
                                    value={newRecord.procedures}
                                    onChange={e => setNewRecord({ ...newRecord, procedures: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Clinical Notes</label>
                                <textarea
                                    rows={3}
                                    placeholder="Patient observations and procedure details..."
                                    value={newRecord.notes}
                                    onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Prescription (Optional)</label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-gray-400">💊</span>
                                    <input
                                        type="text"
                                        placeholder="e.g. Amoxicillin 500mg"
                                        value={newRecord.prescriptions}
                                        onChange={e => setNewRecord({ ...newRecord, prescriptions: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 pl-9 pr-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1.5 block">X-Ray / Attachment URL</label>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3 text-gray-400">📎</span>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/scan.jpg"
                                        value={newRecord.attachmentUrl}
                                        onChange={e => setNewRecord({ ...newRecord, attachmentUrl: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 pl-9 pr-3 py-2 rounded-lg text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRecord}
                                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] transition-all"
                            >
                                Save Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DentistTreatmentRecord;
