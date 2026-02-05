import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminSettings = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        clinicName: 'DentAlign Clinical Center',
        clinicAddress: '72/A, Flower Road, Colombo 07',
        contactEmail: 'contact@dentalign.com',
        contactPhone: '0112 345 678',
        bookingFee: 500,
        enableNotifications: true
    });

    const SidebarItem = ({ to, icon, label, active = false }) => (
        <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600"> DA 🦷 <span className="text-xl font-bold tracking-tight text-gray-900">DentAlign</span></div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <SidebarItem to="/admin/dashboard" icon="📊" label="Dashboard" />
                    <SidebarItem to="/admin/reports" icon="📈" label="Reports & Analytics" />
                    <SidebarItem to="/admin/balance" icon="💰" label="Financial Overview" />
                    <SidebarItem to="/admin/users" icon="👥" label="User Management" />
                    <SidebarItem to="/admin/settings" icon="⚙️" label="Settings" active />
                </nav>
            </aside>

            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure global clinic parameters and notification logic.</p>
                </header>

                <div className="max-w-3xl space-y-8">
                    {/* Clinic Info */}
                    <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-black text-[#111827]">Clinic Profile</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Clinic Name</label>
                                <input type="text" value={settings.clinicName} readOnly className="w-full bg-gray-50 p-4 rounded-xl font-bold text-gray-900 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking Fee (Rs.)</label>
                                <input type="number" value={settings.bookingFee} readOnly className="w-full bg-gray-50 p-4 rounded-xl font-bold text-gray-900 outline-none" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Address</label>
                                <input type="text" value={settings.clinicAddress} readOnly className="w-full bg-gray-50 p-4 rounded-xl font-bold text-gray-900 outline-none" />
                            </div>
                        </div>
                    </section>

                    {/* Automation */}
                    <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-black text-[#111827]">Notification Configuration</h2>
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl">
                            <div>
                                <div className="text-sm font-bold text-[#111827]">Automated SMS Reminders</div>
                                <div className="text-xs text-blue-600 font-bold">Sends alerts 24h before appointment</div>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <div className="text-sm font-bold text-[#111827]">Email Invoicing</div>
                                <div className="text-xs text-gray-400 font-bold">Auto-send PDF to patient on checkout</div>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
