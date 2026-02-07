import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffPatients = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/users/patients`, config);
                setPatients(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [user.token]);

    const filteredPatients = patients.filter(patient =>
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Patient Directory</h1>
                        <p className="text-sm text-gray-600">View all registered patients</p>
                    </div>
                    <button
                        onClick={() => navigate('/staff/book-appointment')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 justify-center"
                    >
                        <span className="text-lg">➕</span>
                        Book Appointment
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, or phone..."
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Total Patients</div>
                        <div className="text-2xl font-black text-gray-900">{patients.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 mb-1">Search Results</div>
                        <div className="text-2xl font-black text-indigo-600">{filteredPatients.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
                        <div className="text-xs font-bold text-gray-500 mb-1">Active</div>
                        <div className="text-2xl font-black text-green-600">{patients.length}</div>
                    </div>
                </div>

                {/* Patients List */}
                <div className="space-y-3">
                    {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                        <div key={patient._id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                    {patient.fullName ? patient.fullName[0] : 'P'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900">{patient.fullName}</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs text-gray-600">📧 {patient.email}</span>
                                        <span className="text-xs text-gray-600">📱 {patient.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => navigate('/staff/book-appointment')}
                                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                                    >
                                        Book
                                    </button>
                                    <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                            <div className="text-4xl mb-3">👥</div>
                            <p className="text-gray-600">No patients found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffPatients;
