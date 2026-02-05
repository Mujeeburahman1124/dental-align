import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DentistTreatmentRecord = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Dr. Sarah Mitchell' };
    const navigate = useNavigate();
    const location = useLocation();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ title: '', procedures: '', notes: '', prescriptions: '', cost: '' });

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

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
                cost: Number(newRecord.cost) || 0
            };
            const { data } = await axios.post('http://localhost:5000/api/treatments', payload, config);
            setTreatments([data, ...treatments]);
            setShowModal(false);
            setNewRecord({ title: '', procedures: '', notes: '', prescriptions: '', cost: '' });
        } catch (error) {
            console.error('Save Record Error:', error);
            alert('Failed to save clinical data');
        }
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
                <header className="mb-12">
                    <h1 className="text-5xl font-black text-[#111827] tracking-tighter">Patient Ecosystem</h1>
                    <p className="text-gray-400 font-bold mt-2 text-lg">Detailed clinical investigation and history management</p>
                </header>

                {!selectedPatient ? (
                    <div className="max-w-4xl">
                        <div className="relative mb-12 group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
                            <input
                                type="text"
                                placeholder="Search ecosystem for patients by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border-none py-6 pl-16 pr-8 rounded-[32px] shadow-sm text-xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/10 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {patients.filter(p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                <button key={p._id} onClick={() => setSelectedPatient(p)} className="bg-white p-8 rounded-[48px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all text-left flex items-start gap-6 group">
                                    <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all">{p.fullName[0]}</div>
                                    <div>
                                        <div className="text-2xl font-black text-[#111827] tracking-tighter mb-1">{p.fullName}</div>
                                        <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">ID: {p._id.slice(-6)}</div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Active Case</span>
                                            <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase">Gen Health OK</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-12">
                        {/* Patient Header */}
                        <div className="col-span-12 flex justify-between items-center bg-white p-10 rounded-[56px] border border-gray-50 shadow-sm mb-4">
                            <div className="flex items-center gap-8">
                                <button onClick={() => setSelectedPatient(null)} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl hover:bg-gray-100 transition-all">←</button>
                                <div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Investigation Profile</div>
                                    <h2 className="text-4xl font-black text-[#111827] tracking-tighter">{selectedPatient.fullName}</h2>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(true)} className="px-8 py-5 bg-blue-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-105 transition-all flex items-center gap-3">
                                <span>📝</span> INITIALIZE CLINICAL RECORD
                            </button>
                        </div>

                        {/* Left Column: Clinical Stats */}
                        <div className="col-span-4 space-y-8">
                            <div className="bg-white p-10 rounded-[56px] border border-gray-50 shadow-sm">
                                <h3 className="text-lg font-black text-[#111827] mb-8 tracking-tighter uppercase tracking-widest text-[11px] text-gray-300">Vitals & Alerts</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center p-4 bg-red-50 rounded-3xl border border-red-100">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">⚠️</span>
                                            <span className="text-xs font-black text-red-600 uppercase tracking-widest">Allergies</span>
                                        </div>
                                        <span className="text-xs font-black text-red-700">Penicillin</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-3xl border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🩸</span>
                                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Blood Type</span>
                                        </div>
                                        <span className="text-xs font-black text-blue-700 font-serif">B+ Positive</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111827] p-10 rounded-[56px] text-white shadow-2xl group">
                                <h3 className="text-xl font-black mb-8 tracking-tighter uppercase tracking-widest text-[11px] text-gray-500">Upcoming Roadmap</h3>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Follow-up Expected</div>
                                    <div className="text-lg font-black tracking-tight">Post-Op Checkup</div>
                                    <div className="text-[10px] text-gray-500 font-bold mt-2 italic">ETA: 4 Days from now</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Case History */}
                        <div className="col-span-8">
                            <section className="bg-white rounded-[64px] border border-gray-50 shadow-sm overflow-hidden min-h-[600px]">
                                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-[#111827] tracking-tighter flex items-center gap-3">
                                        Investigation History
                                    </h2>
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{treatments.length} Records Found</div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {treatments.length > 0 ? treatments.map(t => (
                                        <div key={t._id} className="p-10 hover:bg-gray-50 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{new Date(t.date).toLocaleDateString()}</div>
                                                    <h4 className="text-3xl font-black text-[#111827] tracking-tighter">{t.title}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-[#111827]">Rs. {t.cost.toLocaleString()}</div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${t.paid ? 'text-green-500' : 'text-orange-500'}`}>{t.paid ? 'Settled' : 'Pending Invoice'}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mb-6">
                                                {t.procedures.map((p, i) => (
                                                    <span key={i} className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">{p}</span>
                                                ))}
                                            </div>
                                            <p className="text-gray-400 font-bold text-sm leading-relaxed mb-6">{t.notes}</p>
                                            {t.prescriptions && (
                                                <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 text-orange-700">
                                                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">💊 Clinical RX Issued</div>
                                                    <div className="text-sm font-bold">{t.prescriptions}</div>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center opacity-30 grayscale">
                                            <div className="text-6xl mb-6">📂</div>
                                            <div className="font-black text-xl tracking-tighter text-[#111827]">No Investigation History</div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </main>

            {/* Surgical Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[64px] p-12 shadow-3xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-[#111827] tracking-tighter">Clinical Entry</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-red-500 text-4xl leading-none">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Investigation Title</label>
                                <input type="text" placeholder="e.g. Composite Restoration" value={newRecord.title} onChange={e => setNewRecord({ ...newRecord, title: e.target.value })} className="w-full bg-gray-50 p-5 rounded-3xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Procedures (sep by comma)</label>
                                <input type="text" placeholder="e.g. Scaling, Polishing" value={newRecord.procedures} onChange={e => setNewRecord({ ...newRecord, procedures: e.target.value })} className="w-full bg-gray-50 p-5 rounded-3xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Service Cost (Rs.)</label>
                                <input type="number" placeholder="0.00" value={newRecord.cost} onChange={e => setNewRecord({ ...newRecord, cost: e.target.value })} className="w-full bg-gray-50 p-5 rounded-3xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-2xl" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Clinical Notes</label>
                                <textarea rows={4} placeholder="Enter surgical findings..." value={newRecord.notes} onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })} className="w-full bg-gray-50 p-5 rounded-3xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 block">Prescription (Optional)</label>
                                <textarea rows={2} placeholder="e.g. Paracetamol 500mg BID" value={newRecord.prescriptions} onChange={e => setNewRecord({ ...newRecord, prescriptions: e.target.value })} className="w-full bg-gray-50 p-5 rounded-3xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none" />
                            </div>
                        </div>
                        <button onClick={handleSaveRecord} className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all">SIGN & COMMIT TO LEDGER</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DentistTreatmentRecord;
