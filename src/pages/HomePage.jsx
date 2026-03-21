import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
    {
        icon: '📅',
        title: 'Easy Appointment Booking',
        desc: 'Book your dental appointment online in minutes. Choose your preferred doctor, date, and time slot.',
    },
    {
        icon: '📋',
        title: 'Digital Treatment Records',
        desc: 'Access your complete treatment history, prescriptions, and clinical notes from one secure place.',
    },
    {
        icon: '💳',
        title: 'Billing & Payments',
        desc: 'View invoices, track payment status, and receive digital receipts after each visit.',
    },
    {
        icon: '🩺',
        title: 'Experienced Dentists',
        desc: 'Our team includes qualified specialists in orthodontics, cosmetic dentistry, and oral surgery.',
    },
    {
        icon: '📧',
        title: 'Email Confirmations',
        desc: 'Receive automatic booking confirmation emails with your appointment reference and details.',
    },
    {
        icon: '🔒',
        title: 'Secure & Private',
        desc: 'Your personal and medical information is protected with secure authentication and access control.',
    },
];

const steps = [
    { step: '01', title: 'Create an Account', desc: 'Register as a patient to access booking and your treatment history.' },
    { step: '02', title: 'Book an Appointment', desc: 'Choose a doctor, select a date and time, and confirm your booking.' },
    { step: '03', title: 'Visit the Clinic', desc: 'Attend your appointment. Your dentist updates your records after the visit.' },
    { step: '04', title: 'View & Pay Bill', desc: 'Access your invoice online and view your payment status or receipt.' },
];

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 bg-slate-50 overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-lg shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Next-Gen Patient Care</span>
                            </div>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                Modern Dental Care <br />
                                <span className="text-blue-600">Reimagined.</span>
                            </h1>
                            
                            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-500 font-medium leading-relaxed">
                                Join a community of specialized dental clinics. Manage your oral health through our secure, data-driven platform designed for comfort and precision.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/register" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all">
                                    Register Now
                                </Link>
                                <Link to="/doctors" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 active:scale-95 transition-all">
                                    Meet Specialists
                                </Link>
                            </div>

                            <div className="pt-8 border-t border-slate-200 flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12 text-center lg:text-left">
                                {[
                                    { label: 'Network Points', val: '5+' },
                                    { label: 'Active Specialists', val: '12+' },
                                    { label: 'Clinical Records', val: '2k+' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-bold text-slate-900 leading-none">{stat.val}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-2xl group-hover:bg-blue-600/10 transition-colors"></div>
                            <div className="relative bg-white p-2 rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
                                    alt="Modern Dental Hub"
                                    className="w-full h-[450px] object-cover rounded-xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>)}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest leading-none">
                                                Accepted by <br />
                                                <span className="text-blue-600">2,000+ Profiles</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Board */}
            <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Operational Excellence</div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Ecosystem Architecture</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            Every clinical touchpoint is optimized for patient comfort and doctor efficiency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all group group-hover:-translate-y-1">
                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl mb-6 border border-slate-50 shadow-inner group-hover:bg-blue-50 transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-[12px]">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium italic opacity-80">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Process Flow */}
            <section className="bg-slate-900 py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-8">
                        <div className="text-center lg:text-left space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none uppercase">Clinical Workflow</h2>
                            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">A seamless 4-step integration process</p>
                        </div>
                        <div className="flex -space-x-3 opacity-30">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800"></div>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-xl hover:bg-white/10 transition-all relative group h-full">
                                <div className="text-5xl font-extrabold text-blue-600/20 absolute top-4 right-4 group-hover:text-blue-600/40 transition-colors">{s.step}</div>
                                <div className="space-y-4">
                                    <div className="w-6 h-1 bg-blue-600"></div>
                                    <h3 className="text-lg font-bold text-white leading-tight uppercase tracking-tight">{s.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed opacity-80 italic">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Combined CTA Section */}
            <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 text-center bg-slate-50 border-y border-slate-100">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="space-y-4">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Protocol Start</div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tighter">Initialize Your Clinical Protocol.</h2>
                        <p className="text-slate-500 text-base leading-relaxed font-medium max-w-xl mx-auto">
                            Join over 2,000 patients managing their clinical lifecycle through our cloud infrastructure.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-black transition-all active:scale-95">
                            Create Master Profile
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Access Portal
                        </Link>
                    </div>
                </div>
            </section>

            {/* Refined Footer */}
            <footer className="bg-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">DentAlign</span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm italic opacity-80">
                                Global clinical operations interface. Scalable dental practice management for modern specialists, staff, and patients.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6">Directory</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Specialists', to: '/doctors' },
                                    { label: 'Packages', to: '/packages' },
                                    { label: 'Clinical Logic', to: '/about' },
                                ].map((item) => (
                                    <li key={item.to}>
                                        <Link to={item.to} className="text-sm text-slate-500 font-medium hover:text-blue-600 transition-colors">{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6">Operations</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Terms' },
                                    { label: 'Privacy' },
                                    { label: 'Audit Log' },
                                ].map((item) => (
                                    <li key={item.label}>
                                        <span className="text-sm text-slate-500 font-medium hover:text-blue-600 cursor-pointer transition-colors">{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6">Hub</h4>
                            <div className="space-y-4 text-sm text-slate-400 font-medium italic">
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 text-slate-300">📍</span>
                                    <span>Colombo Cluster, SL</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 text-slate-300">📞</span>
                                    <span>+94 11 200 4000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 DentAlign Enterprise. All protocols observed.</p>
                        <div className="flex gap-6">
                            {['TW', 'IN', 'GH'].map(social => (
                                <span key={social} className="text-[10px] font-bold text-slate-300 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">{social}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
