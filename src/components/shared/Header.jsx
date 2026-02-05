import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007AFF] rounded-lg flex items-center justify-center text-white">DA</div>
          <Link to="/" className="font-bold text-lg text-[#111827]">DentAlign</Link>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-[#007AFF]">Home</Link>
          <Link to="/booking" className="hover:text-[#007AFF]">Book</Link>
          {userInfo && userInfo.role === 'patient' && <Link to="/patient/appointments" className="hover:text-[#007AFF]">My Appointments</Link>}
          {!userInfo ? (
            <Link to="/login" className="text-[#007AFF] font-bold">Login</Link>
          ) : (
            <Link to={userInfo.role === 'patient' ? '/patient/dashboard' : userInfo.role === 'dentist' ? '/dentist/dashboard' : '/admin/dashboard'} className="text-gray-700 font-bold">Dashboard</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
