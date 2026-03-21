import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12 text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <header className="pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest shrink-0">
                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                        Clinical Logic
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
                        The Clinical <span className="text-blue-600">Evolution.</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed italic opacity-80">
                        Redefining professional dental care through patient-centric innovation and digital transformation.
                    </p>
                </div>
            </header>

            <main className="container max-w-6xl mx-auto px-4 sm:px-6 pb-20 min-w-0">
                {/* Story & Image Section */}
                <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center mb-20 sm:mb-32">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight uppercase">The Ecosystem Journey</h2>
                            <div className="space-y-5 text-sm sm:text-base text-slate-500 leading-relaxed font-medium italic opacity-90">
                                <p>
                                    What started as a boutique clinic has evolved into a state-of-the-art center for dental excellence. We have consistently focused on delivering high-precision treatments using digital imaging and minimally invasive techniques.
                                </p>
                                <p>
                                    Our philosophy centers on clinical transparency. Every patient record is digitized, ensuring you have complete ownership over your oral health journey.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 tracking-tight">15+</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Clinical Experience</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 tracking-tight">20k+</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Active Profiles</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-xl p-2 shadow-2xl border border-slate-50 overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200"
                                alt="Modern Clinical Center"
                                className="w-full aspect-square object-cover rounded-lg grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                        </div>
                        {/* Achievement Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-800">
                            <div className="text-2xl mb-2">🏆</div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight mb-1">Global Excellence</h4>
                            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none">AWARDS 2024</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-20 sm:mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">Operational Timeline</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { year: '2018', title: 'The Vision', desc: 'DentAlign was conceptualized to redefine modern care.', icon: '🌱' },
                            { year: '2020', title: 'Cloud Core', desc: 'Fully digitized patient record infrastructure deployed.', icon: '💻' },
                            { year: '2022', title: 'Advanced Imaging', desc: 'Integrated 3D clinical imaging at our main hub.', icon: '🏢' },
                            { year: '2024', title: 'Mass Impact', desc: 'Scaling digital dentistry to 20,000+ patients.', icon: '🚀' }
                        ].map((m, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
                                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform origin-left">{m.icon}</div>
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{m.year}</div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2 uppercase text-[14px]">{m.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed italic opacity-80">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 sm:mb-32">
                    {[
                        { icon: '💙', title: 'Empathy', desc: 'Patient-first mindset in every clinical procedure.' },
                        { icon: '🚀', title: 'Innovation', desc: 'State-of-the-art tech for superior health outcomes.' },
                        { icon: '🤝', title: 'Integrity', desc: 'Radical transparency in diagnostics and billing.' }
                    ].map((val, i) => (
                        <div key={i} className="bg-white p-8 sm:p-10 rounded-xl border border-slate-50 shadow-sm hover:bg-slate-900 group transition-all">
                            <div className="w-12 h-12 bg-slate-50 text-2xl flex items-center justify-center rounded-lg mb-8 border border-slate-50 transition-all group-hover:bg-blue-600">
                                {val.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 transition-colors group-hover:text-white uppercase text-[14px]">{val.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium transition-colors group-hover:text-slate-400 italic opacity-80">{val.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-slate-900 rounded-xl p-10 sm:p-20 text-center text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] -mr-48 -mt-48 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Scale Up</div>
                            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-none uppercase">Join 20k+ Managed Profiles.</h2>
                            <p className="text-slate-400 font-medium italic opacity-80 max-w-xl mx-auto">Access specialized dental care through our established clinical network.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="px-10 py-5 bg-blue-600 text-white font-bold rounded-lg hover:bg-white hover:text-slate-900 transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-blue-500/10">
                                Create Account
                            </Link>
                            <Link to="/doctors" className="px-10 py-5 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/10 active:scale-95">
                                Our Specialists
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HistoryPage;
