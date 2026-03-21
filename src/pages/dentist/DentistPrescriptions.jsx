import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

const DentistPrescriptions = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editId, setEditId] = useState(null);

    const [prescriptions, setPrescriptions] = useState([
        { id: 1, patient: 'Anjali Perera', date: '2023-06-12', medication: 'Amoxicillin 500mg', dosage: '3 times daily', duration: '5 days', instructions: 'Take after meals' },
        { id: 2, patient: 'Kamal Silva', date: '2023-06-11', medication: 'Ibuprofen 400mg', dosage: 'As needed for pain', duration: '3 days', instructions: 'Do not exceed 3 tablets per day' },
        { id: 3, patient: 'Nisha Fernando', date: '2023-06-10', medication: 'Metronidazole 400mg', dosage: '2 times daily', duration: '7 days', instructions: 'Avoid alcohol' },
    ]);
    const [form, setForm] = useState({ patient: '', medication: '', dosage: '', duration: '', instructions: '' });

    const handleCreateOrUpdate = (e) => {
        e.preventDefault();
        if (editId) {
            setPrescriptions(prescriptions.map(p => p.id === editId ? { ...p, ...form } : p));
        } else {
            setPrescriptions([
                { id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] },
                ...prescriptions,
            ]);
        }
        closeModal();
    };

    const handleEdit = (rx) => {
        setForm({
            patient: rx.patient,
            medication: rx.medication,
            dosage: rx.dosage,
            duration: rx.duration,
            instructions: rx.instructions || ''
        });
        setEditId(rx.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            setPrescriptions(prescriptions.filter(p => p.id !== id));
        }
    };

    const closeModal = () => {
        setForm({ patient: '', medication: '', dosage: '', duration: '', instructions: '' });
        setEditId(null);
        setShowModal(false);
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.medication.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="mb-8 flex flex-col xl:flex-row justify-between xl:items-end gap-6">
                    <div className="space-y-2">
                        <Link to="/dentist/dashboard" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Prescriptions</h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                            Manage medication prescriptions for your recent patients.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                        <div className="relative w-full sm:max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search patients or meds..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium"
                            />
                        </div>
                        <button
                            onClick={() => { setEditId(null); setForm({ patient: '', medication: '', dosage: '', duration: '', instructions: '' }); setShowModal(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto whitespace-nowrap"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            New Prescription
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {filteredPrescriptions.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-2xl">💊</div>
                            <h3 className="font-bold text-gray-900">No prescriptions found</h3>
                            <p className="text-sm text-gray-500 mt-1">Submit a new prescription or review your search.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {['Patient', 'Date Issued', 'Medication', 'Dosage', 'Duration', 'Instructions', 'Actions'].map(h => (
                                                <th key={h} className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPrescriptions.map(rx => (
                                            <tr key={rx.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-gray-900">{rx.patient}</div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-semibold text-gray-600">
                                                    {new Date(rx.date).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-bold text-blue-600">{rx.medication}</td>
                                                <td className="px-6 py-5 text-sm font-medium text-gray-700">{rx.dosage}</td>
                                                <td className="px-6 py-5 text-sm font-medium text-gray-700">{rx.duration}</td>
                                                <td className="px-6 py-5 text-xs text-gray-500 max-w-[200px] italic font-medium truncate">
                                                    {rx.instructions || '—'}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <button title="Update Treatment Record" onClick={() => navigate('/dentist/treatment-record', { state: { searchName: rx.patient } })} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                                        </button>
                                                        <button title="Edit Prescription" onClick={() => handleEdit(rx)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        </button>
                                                        <button title="Delete Prescription" onClick={() => handleDelete(rx.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View Cards */}
                            <div className="lg:hidden divide-y divide-gray-100">
                                {filteredPrescriptions.map(rx => (
                                    <div key={rx.id} className="p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="text-sm font-bold text-gray-900">{rx.patient}</div>
                                            <div className="text-[10px] font-bold text-gray-400">{new Date(rx.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 z-0">
                                            <div className="text-xs font-bold text-blue-700">{rx.medication}</div>
                                            <div className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">{rx.dosage} • {rx.duration}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 italic font-medium mb-1">{rx.instructions}</div>

                                        <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-gray-50">
                                            <button onClick={() => navigate('/dentist/treatment-record', { state: { searchName: rx.patient } })} className="flex-1 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100">
                                                Update Record
                                            </button>
                                            <button onClick={() => handleEdit(rx)} className="px-3 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-100">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(rx.id)} className="px-3 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-100">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* New / Edit Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{editId ? 'Edit Prescription' : 'New Prescription'}</h3>
                                <p className="text-sm text-gray-500 mt-1">{editId ? 'Update the existing medication order' : 'Issue a new medication order'}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Patient Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={form.patient}
                                    onChange={e => setForm({ ...form, patient: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    placeholder="e.g. Anjali Perera"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Medication <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={form.medication}
                                    onChange={e => setForm({ ...form, medication: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                    placeholder="e.g. Amoxicillin 500mg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Dosage <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        value={form.dosage}
                                        onChange={e => setForm({ ...form, dosage: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="e.g. 3 times daily"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Duration <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        value={form.duration}
                                        onChange={e => setForm({ ...form, duration: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        placeholder="e.g. 5 days"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Instructions</label>
                                <textarea
                                    value={form.instructions}
                                    onChange={e => setForm({ ...form, instructions: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none h-24"
                                    placeholder="e.g. Take after meals, avoid alcohol..."
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors">
                                    {editId ? 'Update Prescription' : 'Save Prescription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DentistPrescriptions;
