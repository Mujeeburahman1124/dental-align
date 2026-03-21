import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const RestrictedPage = ({ title, children }) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] font-inter">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">{title}</h1>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            To view our {title.toLowerCase()}, please log in to your account. We treat our patient and clinic data with the highest security.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/login" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-10 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-black text-gray-900 mb-8">{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default RestrictedPage;
