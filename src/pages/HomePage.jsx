import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <section className="px-8 py-12 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        Premier Dental Care
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-[#111827] leading-tight tracking-tighter">
                        Your Smile, <br /> Our Clinical Excellence
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Experience precision dental care at DentAlign. Personalizing your treatment with advanced technology and expert professional staff.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link to="/register" className="w-full sm:w-auto bg-[#007AFF] text-white px-10 py-5 rounded-2xl text-md font-bold hover:bg-[#0066D6] transition-all shadow-[0_20px_40px_-15px_rgba(0,122,255,0.3)] hover:scale-105 active:scale-95">
                            Book Visit Now
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto bg-gray-50 text-[#111827] px-10 py-5 rounded-2xl text-md font-bold hover:bg-gray-100 transition-all border border-gray-100">
                            Patient Login
                        </Link>
                    </div>
                </div>
                <div className="flex-1 relative w-full">
                    <div className="w-full aspect-[4/3] bg-gray-50 rounded-[48px] overflow-hidden shadow-2xl relative">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
                            alt="Modern Dental Operatory"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    {/* Simplified Stat Badge */}
                    <div className="absolute -bottom-6 -right-6 md:right-12 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 flex items-center gap-4 animate-float">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="text-xl">✨</span>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-[#111827]">99%</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Successful <br /> Procedures</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Stats - Single Clinic Focused */}
            <section className="px-8 py-12 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <div className="bg-gray-50 p-6 md:p-8 rounded-[32px] border border-gray-100 text-center hover:bg-white transition-all hover:shadow-xl group">
                    <div className="text-3xl font-black text-[#111827] mb-1 group-hover:text-blue-600">5+</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Years Experience</div>
                </div>
                <div className="bg-gray-50 p-6 md:p-8 rounded-[32px] border border-gray-100 text-center hover:bg-white transition-all hover:shadow-xl group">
                    <div className="text-3xl font-black text-[#111827] mb-1 group-hover:text-blue-600">2.5k+</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Happy Patients</div>
                </div>
                <div className="bg-gray-50 p-6 md:p-8 rounded-[32px] border border-gray-100 text-center hover:bg-white transition-all hover:shadow-xl group">
                    <div className="text-3xl font-black text-[#111827] mb-1 group-hover:text-blue-600">24/7</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emergency Care</div>
                </div>
                <div className="bg-gray-50 p-6 md:p-8 rounded-[32px] border border-gray-100 text-center hover:bg-white transition-all hover:shadow-xl group">
                    <div className="text-3xl font-black text-[#111827] mb-1 group-hover:text-blue-600">ISO</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certified Safety</div>
                </div>
            </section>

            {/* Quick Feature Strip */}
            <section className="px-8 py-16 bg-gray-50/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex items-start gap-6">
                        <div className="text-3xl">🗓️</div>
                        <div>
                            <h3 className="font-black text-[#111827] mb-2 uppercase tracking-tight text-sm">Instant Booking</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Reserve your session in seconds through our clinical portal.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="text-3xl">📊</div>
                        <div>
                            <h3 className="font-black text-[#111827] mb-2 uppercase tracking-tight text-sm">Digital Records</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Secure access to all your treatment history and X-rays.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="text-3xl">🌿</div>
                        <div>
                            <h3 className="font-black text-[#111827] mb-2 uppercase tracking-tight text-sm">Modern Hygiene</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">State-of-the-art sterilization and patient care protocols.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-8 py-12 border-t border-gray-50 text-center bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">D</div>
                        <span className="text-xl font-black text-[#111827]">DentAlign Clinic</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
                        Precision Dentistry • Clinical Excellence
                    </div>
                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        © 2024 DentAlign. 01 Main Road, Clinic City
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
