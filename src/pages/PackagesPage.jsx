import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const packages = [
    {
        name: 'Basic Checkup',
        price: 'Rs. 2,500',
        per: 'per visit',
        popular: false,
        features: [
            'Full Dental Consultation',
            'Professional Scaling & Polishing',
            'Comprehensive Oral Assessment',
            'Personalized Hygiene Report',
        ],
        icon: '🦷',
    },
    {
        name: 'Premium Whitening',
        price: 'Rs. 15,000',
        per: 'full treatment',
        popular: true,
        features: [
            'Professional Laser Whitening',
            'Enamel Sensitivity Treatment',
            'Deep External Stain Removal',
            'Take-home Maintenance Kit',
        ],
        icon: '✨',
    },
    {
        name: 'Family Wellness',
        price: 'Rs. 8,500',
        per: 'up to 4 members',
        popular: false,
        features: [
            'Priority Booking Access',
            'Free Initial Consultation',
            'Routine Health Screenings',
            'Emergency Dental Support',
        ],
        icon: '🏠',
    },
];

const PackagesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                <header className="mb-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                        Service <span className="text-blue-600">Packages</span>
                    </h1>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
                        Choose the right dental care plan for you and your family. We offer transparent pricing and comprehensive treatments.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg, i) => (
                        <div
                            key={i}
                            className={`flex flex-col bg-white rounded-2xl border p-8 transition-all hover:border-blue-300 shadow-sm relative overflow-hidden group
                                ${pkg.popular ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-200'}`}
                        >
                            {pkg.popular && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase py-1.5 px-4 rounded-bl-xl tracking-widest shadow-sm">
                                    Popular Choice
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl mb-4 border border-slate-100 group-hover:bg-blue-50 transition-all">
                                    {pkg.icon}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2 truncate">{pkg.name}</h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-slate-900">{pkg.price}</span>
                                    <span className="text-xs text-slate-400 font-medium">{pkg.per}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 flex-1 mb-8">
                                {pkg.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="leading-tight">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/booking"
                                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center block shadow-sm active:scale-95
                                    ${pkg.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                Book Appointment
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom Card - Corporate */}
                <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group transition-all hover:border-blue-200">
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-inner border border-slate-100 transition-transform group-hover:scale-105">🏢</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-none">Corporate Plans</h3>
                            <p className="text-sm text-slate-500 font-medium">We offer tailored dental benefits for local businesses and large organizations.</p>
                        </div>
                    </div>
                    <a
                        href="tel:+94112345678"
                        className="px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                        Contact Us
                    </a>
                </div>
            </main>
        </div>
    );
};

export default PackagesPage;
