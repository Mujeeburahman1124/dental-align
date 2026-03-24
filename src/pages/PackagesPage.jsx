import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const packages = [
    {
        name: 'Initial Clinical Assessment',
        price: 'Rs. 2,500',
        per: 'Per Consultation',
        popular: false,
        features: [
            'Full Digital Oral Mapping',
            'Professional Prophylaxis',
            'Comprehensive Diagnostic Report',
            'Treatment Plan Roadmap',
        ],
        icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"></path></svg>,
    },
    {
        name: 'Advanced Aesthetic Whitening',
        price: 'Rs. 15,000',
        per: 'Full Clinical Protocol',
        popular: true,
        features: [
            'Precision Laser Activation',
            'Enamel Integrity Treatment',
            'Subsurface Stain Eradication',
            'Home Stabilization Protocol',
        ],
        icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8M8 12h8"></path></svg>,
    },
    {
        name: 'Multi-Patient Wellness',
        price: 'Rs. 8,500',
        per: 'Up to 4 Beneficiaries',
        popular: false,
        features: [
            'Priority Specialized Access',
            'Institutional Screening Program',
            'Clinical Health Oversight',
            '24/7 Faculty Support',
        ],
        icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    },
];

const PackagesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans pb-12 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                <header className="mb-16 text-center lg:text-left border-b border-slate-100 pb-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                        Clinical Programs
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                        Service <span className="text-blue-600">Protocols</span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl font-medium leading-relaxed italic opacity-80">
                        Choose the precision oral health program tailored for your clinical requirements. All protocols include digital diagnostic oversight.
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
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    {pkg.icon}
                                </div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 truncate">{pkg.name}</h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-slate-900 tracking-tight">Rs. {pkg.price.replace('Rs. ', '')}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pkg.per}</span>
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
                                className={`w-full py-3.5 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-center block shadow-sm active:scale-95
                                    ${pkg.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                Initiate Booking
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom Card - Corporate */}
                <div className="mt-16 bg-slate-900 rounded p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl -mr-32 -mt-32 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 text-center md:text-left">
                            <div className="w-16 h-16 bg-white/10 rounded border border-white/20 flex items-center justify-center shrink-0">
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7"></path><path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 tracking-tight">Institutional Partnerships</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Tailored oral healthcare frameworks for corporate entities and medical academic faculties.</p>
                            </div>
                        </div>
                        <a
                            href="mailto:partnerships@dentalign.com"
                            className="px-10 py-5 bg-white text-slate-900 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            Inquire Now
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PackagesPage;
