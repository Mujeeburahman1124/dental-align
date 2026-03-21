import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-white/10 sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🦷</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-white tracking-tighter">
                Dent<span className="text-blue-200">Align</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white/90 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-white/20 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right flex flex-col justify-center">
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                  <p className="text-sm font-bold text-white tracking-tight leading-none">{user.fullName || 'User'}</p>
                </div>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="bg-white text-blue-700 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-md active:scale-95"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/70 hover:text-white group"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white hover:text-white/80 px-4 py-2 text-sm font-bold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-md active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900 border-t border-white/10 py-6">
          <div className="px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-4 py-3 rounded-xl text-base font-bold text-white hover:bg-white/10 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <p className="px-4 text-sm text-blue-200 font-bold">{user.fullName}</p>
                  <Link
                    to={`/${user.role}/dashboard`}
                    className="block w-full bg-white text-blue-700 text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full border border-white/20 text-white text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full border border-white/20 text-white text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full bg-white text-blue-700 text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
