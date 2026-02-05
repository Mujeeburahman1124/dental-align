import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff Member' };
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ todayCount: 0, pendingConfirmation: 0, totalPatients: 0 });
    const [loading, setLoading] = useState(true);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Fetching all appointments for staff to manage
            const resAppt = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
            setAppointments(resAppt.data || []);

            const today = new Date().toISOString().split('T')[0];
            const todayAppts = resAppt.data.filter(a => a.date.split('T')[0] === today);
            setStats({
                todayCount: todayAppts.length,
                pendingConfirmation: resAppt.data.filter(a => a.status === 'pending').length,
                totalPatients: [...new Set(resAppt.data.map(a => a.patient?._id))].length
            });

        } catch (error) {
            console.error('Error fetching staff dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleConfirm = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status: 'confirmed' }, config);
            fetchData();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleGenerateInvoice = (appt) => {
        setSelectedAppt(appt);
        setShowInvoiceModal(true);
    };

    const SidebarItem = ({ to, icon, label, active = false }) => (
        <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <span className="text-2xl">🦷</span>
                        <span className="text-xl font-bold tracking-tight text-gray-900">DentAlign</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">Front Desk Portal</div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarItem to="/staff/dashboard" icon="🏛️" label="Dashboard" active />
                    {/* Role-specific management pages */}
                    <SidebarItem to="/staff/appointments" icon="📅" label="Appointments" />
                    <SidebarItem to="/staff/patients" icon="👥" label="Patient Directory" />
                    <SidebarItem to="/staff/billing" icon="📝" label="Billing & Invoicing" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={logout} className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2">
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Efficiently manage clinic flow and patient settlement.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all">
                            New Walk-in
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Today's Visits</div>
                        <div className="text-4xl font-bold text-gray-900">{stats.todayCount}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Awaiting Confirmation</div>
                        <div className="text-4xl font-bold text-orange-500">{stats.pendingConfirmation}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Monthly New Patients</div>
                        <div className="text-4xl font-bold text-green-600">{stats.totalPatients}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900">Clinical Management Queue</h2>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">Live Sync</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {loading ? (
                                    <div className="p-12 text-center text-gray-400">Loading clinicial data...</div>
                                ) : appointments.length > 0 ? appointments.map(appt => (
                                    <div key={appt._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-100 transition-colors text-xl">
                                                {appt.patient?.fullName ? appt.patient.fullName[0] : 'P'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{appt.patient?.fullName || 'Guest Patient'}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-[#111827]">{appt.reason}</span>
                                                    <span className="text-[10px] text-gray-400 italic">• {appt.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {appt.status === 'pending' && (
                                                <button onClick={() => handleConfirm(appt._id)} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">Confirm</button>
                                            )}
                                            {appt.status === 'completed' && !appt.isFeePaid && (
                                                <button onClick={() => handleGenerateInvoice(appt)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100">Checkout / Bill</button>
                                            )}
                                            {appt.status === 'confirmed' && (
                                                <span className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 rounded-lg">In Session</span>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-16 text-center text-gray-400 italic">No appointments scheduled for today.</div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Staff on Duty</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center text-lg">👩‍⚕️</div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Dr. Mitchell</div>
                                            <div className="text-[10px] font-bold text-green-600 uppercase">Consulting</div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center text-lg">👨‍⚕️</div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Dr. Ahmed</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Break</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                            <h3 className="text-xl font-bold mb-2">Revenue Today</h3>
                            <div className="text-4xl font-black italic">Rs. 18,500</div>
                            <p className="text-indigo-100 text-xs mt-4 font-bold uppercase tracking-widest">+12% from yesterday</p>
                        </div>
                    </div>
                </div>

                {/* MODAL for Invoice Generation (Post-Treatment Settlement) */}
                {showInvoiceModal && selectedAppt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/20 animate-fade-in">
                        <div className="bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl space-y-8 animate-pop-in">
                            <div className="text-center">
                                <h2 className="text-3xl font-black text-[#111827] tracking-tight">Generate Final Bill</h2>
                                <p className="text-gray-400 font-bold mt-2">Settle charges for {selectedAppt.patient?.fullName}</p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[32px] space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-gray-400">Treatment: {selectedAppt.reason}</span>
                                    <span className="text-[#111827]">Rs. {selectedAppt.estimatedCost.toLocaleString()}</span>
                                </div>
                                {!selectedAppt.isFeePaid && (
                                    <div className="flex justify-between items-center text-sm font-bold text-indigo-600 py-3 border-t border-b border-gray-100">
                                        <span>Unpaid Booking Fee</span>
                                        <span>Rs. {selectedAppt.bookingFee || 500}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-xl font-black text-[#111827]">Total Due Now</span>
                                    <span className="text-3xl font-black text-indigo-600">Rs. {(selectedAppt.estimatedCost + (!selectedAppt.isFeePaid ? 500 : 0)).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={() => {
                                    alert('Invoicing Complete. Notification sent to patient.');
                                    setShowInvoiceModal(false);
                                }} className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">Complete & Print Invoice</button>
                                <button onClick={() => setShowInvoiceModal(false)} className="w-full text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#111827]">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StaffDashboard;
