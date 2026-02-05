import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-[#111827]">DentAlign</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <Link
                        to="/"
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/') ? 'bg-white text-[#007AFF] shadow-sm' : 'text-gray-500 hover:text-[#007AFF]'}`}
                    >
                        Home
                    </Link>

                    {user && user.role === 'patient' && (
                        <Link
                            to="/booking"
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/booking') ? 'bg-white text-[#007AFF] shadow-sm' : 'text-gray-500 hover:text-[#007AFF]'}`}
                        >
                            Book Appointment
                        </Link>
                    )}

                    {user && (
                        <>
                            <Link
                                to={`/${user.role}/dashboard`}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(`/${user.role}/dashboard`) ? 'bg-white text-[#007AFF] shadow-sm' : 'text-gray-500 hover:text-[#007AFF]'}`}
                            >
                                Dashboard
                            </Link>

                            {user.role === 'patient' && (
                                <Link
                                    to="/patient/records"
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/patient/records') ? 'bg-white text-[#007AFF] shadow-sm' : 'text-gray-500 hover:text-[#007AFF]'}`}
                                >
                                    My Records
                                </Link>
                            )}

                            {user.role === 'admin' && (
                                <Link
                                    to="/admin/balance"
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/admin/balance') ? 'bg-white text-[#007AFF] shadow-sm' : 'text-gray-500 hover:text-[#007AFF]'}`}
                                >
                                    Finance
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <div className="text-sm font-bold text-[#111827]">{user.fullName}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Logout"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-gray-500 hover:text-[#111827] px-6 py-2.5 text-sm font-bold">Sign In</Link>
                            <Link to="/register" className="bg-[#007AFF] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0066D6] transition-all shadow-lg shadow-blue-100">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
