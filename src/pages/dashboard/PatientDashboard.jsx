import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PatientDashboard = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Patient', _id: '0000' };
    const navigate = useNavigate();
    const location = useLocation();
    const [nextAppointment, setNextAppointment] = useState(null);
    const [billingSummary, setBillingSummary] = useState({ outstandingBalance: 0, bookingFeesDue: 0, treatmentCostsDue: 0, unpaidCount: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Parallel fetching
            const [resAppt, resSummary, resNotif] = await Promise.all([
                axios.get('http://localhost:5000/api/appointments/my-appointments', config),
                axios.get('http://localhost:5000/api/payments/summary', config),
                axios.get('http://localhost:5000/api/notifications', config)
            ]);

            if (resAppt.data?.length > 0) {
                const upcoming = resAppt.data.find(a => new Date(a.date) >= new Date() && a.status !== 'cancelled');
                setNextAppointment(upcoming || resAppt.data[0]);
            }
            setBillingSummary(resSummary.data);
            setNotifications(resNotif.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const markRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/notifications/${id}`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
        } catch (error) {
            console.error('Mark read error:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const SidebarItem = ({ to, icon, label }) => {
        const isActive = location.pathname === to || (to === '/patient-dashboard' && location.pathname === '/patient/dashboard');
        return (
            <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-100'}`}>
                <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="font-bold text-sm tracking-tight">{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#F3F6F9] flex font-inter">
            {/* Sidebar Navigation */}
            <aside className="w-[300px] bg-white border-r border-gray-100 flex flex-col p-8 fixed h-full z-20 hidden lg:flex">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">D</div>
                    <span className="text-2xl font-black text-[#111827] tracking-tighter">DentAlign</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem to="/patient/dashboard" icon="🏠" label="Command Center" />
                    <SidebarItem to="/booking" icon="📅" label="Secure Booking" />
                    <SidebarItem to="/patient/billing" icon="💳" label="Finance Hub" />
                    <SidebarItem to="/patient/records" icon="🦷" label="Medical Records" />
                    <SidebarItem to="/patient/appointments" icon="📜" label="My Visits" />
                </nav>

                <div className="mt-auto p-6 bg-gray-50 rounded-[32px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">{user.fullName[0]}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-black text-[#111827] truncate">{user.fullName}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">Premium Member</div>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full bg-white border border-gray-200 py-3 rounded-xl font-bold text-xs text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">Sign Out</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-[300px] p-8 lg:p-12 relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-[#111827] tracking-tighter mb-2">Command Center</h1>
                        <p className="text-gray-400 font-bold">Comprehensive overview of your dental health & finances</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm text-2xl transition-all ${unreadCount > 0 ? 'ring-2 ring-blue-100' : ''}`}
                            >
                                🔔
                                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#F3F6F9]">{unreadCount}</span>}
                            </button>

                            {/* Notification Flyout */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-[400px] bg-white rounded-[40px] shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-pop-in">
                                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="text-xl font-black text-[#111827] tracking-tight">Alert Center</h3>
                                        <button onClick={() => setShowNotifications(false)} className="text-gray-300 hover:text-gray-900 font-light text-2xl">×</button>
                                    </div>
                                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                                        {notifications.length > 0 ? notifications.map(n => (
                                            <div key={n._id} onClick={() => n.status === 'unread' && markRead(n._id)} className={`p-6 border-b border-gray-50 flex gap-4 transition-colors cursor-pointer ${n.status === 'unread' ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${n.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                                    n.type === 'payment' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {n.type === 'appointment' ? '📅' : n.type === 'payment' ? '💳' : 'ℹ️'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm leading-relaxed ${n.status === 'unread' ? 'font-bold text-[#111827]' : 'text-gray-500'}`}>{n.message}</p>
                                                    <div className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                {n.status === 'unread' && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>}
                                            </div>
                                        )) : (
                                            <div className="p-16 text-center opacity-30 grayscale">
                                                <div className="text-4xl mb-4">📭</div>
                                                <div className="font-black text-sm tracking-tighter text-[#111827]">NO RECENT ALERTS</div>
                                            </div>
                                        )}
                                    </div>
                                    <Link to="/patient/alerts" className="block text-center p-6 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-gray-50/50 hover:bg-gray-100 transition-colors">Clear All History</Link>
                                </div>
                            )}
                        </div>
                        <Link to="/booking" className="bg-[#111827] text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">New Reservation</Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Financial Center */}
                    <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[56px] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Unpaid Balance</div>
                            <div className="relative z-10 text-5xl font-black text-orange-500 tracking-tighter">Rs. {billingSummary.outstandingBalance.toLocaleString()}</div>
                            <div className="relative z-10 mt-8 flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-400">{billingSummary.unpaidCount} Pending Items</div>
                                <Link to="/patient/billing" className="text-[10px] font-black text-[#111827] uppercase tracking-widest hover:text-blue-600 transition-colors bg-gray-50 px-4 py-2 rounded-xl">Settle Now →</Link>
                            </div>
                        </div>

                        <div className="bg-[#111827] p-10 rounded-[56px] shadow-3xl relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full translate-x-20 translate-y-20 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Lifetime Commitment</div>
                            <div className="relative z-10 text-5xl font-black text-white tracking-tighter">Rs. {billingSummary.totalSpent?.toLocaleString() || '0'}</div>
                            <div className="relative z-10 mt-8 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Premium Clinical Standing</span>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[56px] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10 text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Patient Status</div>
                            <div className="relative z-10 text-5xl font-black text-green-500 tracking-tighter">Active</div>
                            <div className="relative z-10 mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Grade: Verified</div>
                        </div>
                    </div>

                    {/* Left Column: Health & Visits */}
                    <div className="xl:col-span-8 space-y-10">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-[#111827] tracking-tighter flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                                    Clinical Roadmap
                                </h2>
                                <Link to="/patient/appointments" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-blue-600 transition-colors">View All Schedule</Link>
                            </div>

                            {nextAppointment ? (
                                <div className="bg-white rounded-[56px] border border-gray-100 shadow-sm hover:shadow-4xl transition-all duration-700 overflow-hidden group">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="bg-[#F8FAFC] p-16 flex flex-col items-center justify-center text-center group-hover:bg-blue-50/50 transition-colors duration-700">
                                            <div className="text-[11px] font-black text-[#007AFF] uppercase tracking-[0.4em] mb-4">{new Date(nextAppointment.date).toLocaleString('default', { month: 'long' })}</div>
                                            <div className="text-8xl font-black text-[#111827] tracking-tighter mb-4">{new Date(nextAppointment.date).getDate()}</div>
                                            <div className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{nextAppointment.time}</div>
                                        </div>
                                        <div className="flex-1 p-16 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Procedure</div>
                                                        <h3 className="text-4xl font-black text-[#111827] tracking-tight">{nextAppointment.reason}</h3>
                                                    </div>
                                                    <span className="bg-blue-50 text-[#007AFF] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">Confirmed Visit</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-12 mb-12">
                                                    <div>
                                                        <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Clinical Specialist</div>
                                                        <div className="text-lg font-black text-[#111827]">Dr. {nextAppointment.dentist?.fullName}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Facility Station</div>
                                                        <div className="text-lg font-black text-[#111827]">Surgical Suite 04</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => navigate('/patient/appointments')} className="bg-[#111827] text-white px-12 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all">CHECK IN PROTOCOL</button>
                                                <button className="bg-white border border-gray-100 text-[#111827] px-12 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-50 hover:border-gray-200 transition-all">RESCHEDULE</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[64px] p-24 text-center border-2 border-dashed border-gray-100 group transition-all hover:bg-blue-50/20 hover:border-blue-100">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 group-hover:scale-125 transition-transform duration-1000 shadow-xl shadow-blue-50/50">✨</div>
                                    <h3 className="text-4xl font-black text-[#111827] mb-6 tracking-tighter">Clinical Roadmap is Clear</h3>
                                    <p className="text-gray-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed text-sm">No scheduled procedures found. Reserve your clinical session to maintain your dental hygiene protocols.</p>
                                    <Link to="/booking" className="bg-[#007AFF] text-white px-14 py-6 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-3xl shadow-blue-200/50 hover:scale-[1.05] active:scale-95 transition-all">RESERVE CONSULTATION</Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="xl:col-span-4 space-y-10">
                        {/* Clinical Summary Mini Card */}
                        <div className="bg-white p-12 rounded-[56px] border border-gray-50 shadow-sm space-y-10 group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-12 -translate-y-12"></div>
                            <h3 className="text-xl font-black text-[#111827] tracking-tight relative z-10 uppercase tracking-widest text-[11px] text-gray-300">Live Health Stream</h3>
                            <div className="space-y-8 relative z-10">
                                {notifications.length > 0 ? notifications.slice(0, 3).map(n => (
                                    <div key={n._id} className="flex gap-5 items-start">
                                        <div className={`w-12 h-12 rounded-[20px] shrink-0 flex items-center justify-center shadow-sm ${n.type === 'appointment' ? 'bg-blue-50 text-blue-500' :
                                            n.type === 'payment' ? 'bg-green-50 text-green-500' :
                                                'bg-gray-50 text-gray-400'
                                            }`}>
                                            {n.type === 'appointment' ? '📅' : n.type === 'payment' ? '💰' : '🔔'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[13px] font-bold text-[#111827] leading-relaxed line-clamp-2">{n.message}</div>
                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">{new Date(n.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-xs font-bold text-gray-300 italic py-10 text-center">No recent health protocol updates.</div>
                                )}
                            </div>
                            <Link to="/patient/records" className="block text-center text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:text-blue-800 transition-colors pt-4">Full Case History →</Link>
                        </div>

                        {/* Wellness Directive */}
                        <div className="bg-[#111827] p-12 rounded-[56px] text-white relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-12 text-[120px] opacity-10 group-hover:rotate-12 transition-transform duration-1000 font-serif leading-none">"</div>
                            <h4 className="text-[11px] font-black text-blue-300 uppercase tracking-[0.4em] mb-6">Medical Directive</h4>
                            <p className="text-xl font-black leading-relaxed italic relative z-10 tracking-tight">
                                "Flossing removes plaque from areas where a toothbrush cannot reach. It is critical for preventing periodontal diseases."
                            </p>
                            <div className="mt-10 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
