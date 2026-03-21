import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/dentist/dashboard', icon: '🩺', label: 'Dashboard' },
    { to: '/dentist/records', icon: '📋', label: 'Clinical Records' },
    { to: '/dentist/prescriptions', icon: '💊', label: 'Prescriptions' },
    { to: '/dentist/calendar', icon: '📅', label: 'Calendar' },
    { to: '/dentist/settings', icon: '👤', label: 'My Profile' },
];

const DentistSidebar = ({ isOpen, onClose, onLogout }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 
                transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static lg:inset-0 lg:z-0
            `}>
                <div className="h-full flex flex-col min-w-0">
                    {/* Brand */}
                    <div className="p-8 border-b border-gray-50 bg-blue-50/30 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <span className="text-xl font-black">D</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-black text-gray-900 tracking-tighter truncate uppercase italic">DentAlign</h1>
                                <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-0.5 opacity-70">Medical Hub</p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {NAV_LINKS.map((link) => {
                            const active = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden
                                        ${active 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <span className={`text-xl transition-transform group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-60'}`}>{link.icon}</span>
                                    <span className="text-sm font-extrabold uppercase tracking-tight truncate">{link.label}</span>
                                    {active && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/20"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Exit */}
                    <div className="p-6 border-t border-gray-50 shrink-0">
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all group font-extrabold uppercase tracking-widest text-[11px] overflow-hidden"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center transition-colors group-hover:bg-red-100 shrink-0">
                                <span className="text-sm">🚪</span>
                            </div>
                            <span className="truncate">Exit Session</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DentistSidebar;
