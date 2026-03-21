import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminSettings = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        clinicName: 'DentAlign Dental Clinic',
        clinicAddress: '72/A, Flower Road, Colombo 07',
        contactEmail: 'contact@dentalign.com',
        contactPhone: '0112 345 678',
        bookingFee: 500,
        enableNotifications: true,
        enableEmailInvoicing: false
    });

    const toggleNotification = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <header className="mb-8 sm:mb-12">
                    <div className="space-y-2">
                        <Link to="/admin/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Clinic Settings</h1>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xl">Configure basic clinic info, booking fees, and automated notifications.</p>
                    </div>
                </header>

                <div className="space-y-6 sm:space-y-8">
                    {/* Clinic Information */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Clinic Information</h2>
                                <p className="text-sm text-gray-500 font-medium">Basic details about your clinic branch</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clinic Name</label>
                                <input
                                    type="text"
                                    value={settings.clinicName}
                                    readOnly
                                    className="w-full bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booking Fee (Rs.)</label>
                                <input
                                    type="number"
                                    value={settings.bookingFee}
                                    readOnly
                                    className="w-full bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 outline-none"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clinic Address</label>
                                <input
                                    type="text"
                                    value={settings.clinicAddress}
                                    readOnly
                                    className="w-full bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-end">
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Edit Profile Info</button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Notification Settings</h2>
                                <p className="text-sm text-gray-500 font-medium">Manage automated clinic communications</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-bold text-gray-900">SMS Reminders</div>
                                    <div className="text-xs text-gray-500 font-medium">Send automated reminders 24h before appointments</div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('enableNotifications')}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-bold text-gray-900">Email Invoicing</div>
                                    <div className="text-xs text-gray-500 font-medium">Automatically email receipts to patients after checkout</div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('enableEmailInvoicing')}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${settings.enableEmailInvoicing ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableEmailInvoicing ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="pt-4 flex justify-end">
                        <button className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors active:scale-95">
                            Update Settings
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
