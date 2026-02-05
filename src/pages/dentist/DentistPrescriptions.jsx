import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DentistPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([
        { id: 1, patient: 'Anjali Perera', date: '2023-06-12', medication: 'Amoxicillin 500mg', dosage: '3 times daily', duration: '5 days', instructions: 'Take after meals' },
        { id: 2, patient: 'Kamal Silva', date: '2023-06-11', medication: 'Ibuprofen 400mg', dosage: 'As needed for pain', duration: '3 days', instructions: 'Do not exceed 3 tablets per day' },
        { id: 3, patient: 'Nisha Fernando', date: '2023-06-10', medication: 'Metronidazole 400mg', dosage: '2 times daily', duration: '7 days', instructions: 'Avoid alcohol' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newPrescription, setNewPrescription] = useState({ patient: '', medication: '', dosage: '', duration: '', instructions: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        const newItem = {
            id: prescriptions.length + 1,
            ...newPrescription,
            date: new Date().toISOString().split('T')[0]
        };
        setPrescriptions([newItem, ...prescriptions]);
        setShowModal(false);
        setNewPrescription({ patient: '', medication: '', dosage: '', duration: '', instructions: '' });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-8 font-inter">
            <div className="bg-white w-full max-w-[1440px] flex rounded-[40px] shadow-xl overflow-hidden border border-gray-100">

                {/* Sidebar Navigation (Reused) */}
                <aside className="w-64 border-r border-gray-50 flex flex-col h-full bg-white">
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <span className="font-bold text-xl">D</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-[#111827]">DentAlign</span>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dentist Portal</div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <Link to="/dentist/dashboard" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">📅</span>Dashboard
                        </Link>
                        <Link to="/dentist/records" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">📋</span>Patient Records
                        </Link>
                        <Link to="/dentist/prescriptions" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold bg-[#007AFF]/10 text-[#007AFF]">
                            <span className="text-xl">💊</span>Prescriptions
                        </Link>
                        <Link to="/dentist/calendar" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">🗓️</span>Calendar
                        </Link>
                        <Link to="/dentist/settings" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                            <span className="text-xl">⚙️</span>Settings
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-12 bg-white overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#111827]">Partner Pharmacy & Prescriptions</h1>
                                <p className="text-gray-400 font-bold mt-2">Manage patient medications and history</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-[#007AFF] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-[#0066D6] transition-all flex items-center gap-2"
                            >
                                <span>➕</span> Issue New Prescription
                            </button>
                        </div>

                        {/* Prescription List */}
                        <div className="space-y-4">
                            {prescriptions.map((script) => (
                                <div key={script.id} className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all flex items-center gap-6">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                                        Rx
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#111827]">{script.patient}</h3>
                                        <p className="text-sm font-medium text-gray-500">{script.date} • {script.medication}</p>
                                        <div className="mt-2 text-xs font-bold text-gray-400 bg-gray-50 inline-block px-3 py-1 rounded-lg">
                                            {script.dosage} • {script.duration} • {script.instructions}
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-[#007AFF] font-bold text-sm">Print</button>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>
            </div>

            {/* New Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
                    <div className="bg-white p-8 rounded-[32px] w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-extrabold text-[#111827] mb-6">Issue Prescription</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Patient Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newPrescription.patient}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, patient: e.target.value })}
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#007AFF] outline-none font-bold text-[#111827] transition-all"
                                    placeholder="Ex: Anjali Perera"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Medication</label>
                                <input
                                    type="text"
                                    required
                                    value={newPrescription.medication}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#007AFF] outline-none font-bold text-[#111827] transition-all"
                                    placeholder="Ex: Amoxicillin 500mg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Dosage</label>
                                    <input
                                        type="text"
                                        required
                                        value={newPrescription.dosage}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#007AFF] outline-none font-bold text-[#111827] transition-all"
                                        placeholder="Ex: 3x Daily"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                                    <input
                                        type="text"
                                        required
                                        value={newPrescription.duration}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#007AFF] outline-none font-bold text-[#111827] transition-all"
                                        placeholder="Ex: 5 Days"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Instructions</label>
                                <textarea
                                    value={newPrescription.instructions}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-[#007AFF] outline-none font-bold text-[#111827] transition-all h-24"
                                    placeholder="Ex: Take after meals..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 bg-[#007AFF] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-[#0066D6] transition-all">Issue Rx</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DentistPrescriptions;
