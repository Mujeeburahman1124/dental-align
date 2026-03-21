import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MALE_IMAGES = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1622902046580-2b47f47f0871?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1537368910025-72134cb02558?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1550126330-11279d455e9d?auto=format&fit=crop&q=80&w=600',
];
const FEMALE_IMAGES = [
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=600',
];
const FEMALE_NAMES = ['sarah', 'aqeela', 'mary', 'jane', 'alice', 'elena', 'sophia', 'olivia', 'emma',
    'isabella', 'mia', 'zoe', 'lily', 'grace', 'chloe', 'mariam', 'zainab', 'sumaiya', 'safiya',
    'hana', 'leila', 'yasmin', 'amira', 'dalia', 'farah', 'lina', 'maya', 'noor', 'rania', 'sana',
    'tara', 'yara', 'zahra', 'priya', 'anushka', 'isabel', 'claire', 'shara', 'mivchal', 'nimali',
    'hasini', 'dilini', 'kawya', 'fatima', 'ayesha', 'khadija', 'amali', 'shehani', 'tharushi',
    'pavithra', 'gayathri', 'sanduni', 'imasha', 'nethmi', 'shani', 'kavindya', 'dr. shara', 'dr. mivchal'];

const getBio = (doc) => {
    if (doc.bio) return doc.bio;
    const lastName = doc.fullName.split(' ').pop();
    const spec = (doc.specialization || '').toLowerCase();
    if (spec.includes('ortho')) return `Dr. ${lastName} is a certified orthodontist with expertise in braces and clear aligners.`;
    if (spec.includes('surgery') || spec.includes('oral')) return `Dr. ${lastName} specialises in oral surgery, including complex extractions and dental implants.`;
    if (spec.includes('pediatric')) return `Dr. ${lastName} focuses on dental care for children and young patients.`;
    if (spec.includes('periodontic')) return `Dr. ${lastName} is a gum health specialist experienced in treating periodontal disease.`;
    return `Dr. ${lastName} is an experienced dentist specialising in restorative and cosmetic dental procedures.`;
};

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/dentists`)
            .then(({ data }) => setDoctors(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
                <header className="mb-12 sm:mb-20 text-center md:text-left border-b border-slate-100 pb-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                        Medical Faculty
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Our Clinical <span className="text-blue-600">Specialists</span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-2xl font-medium leading-relaxed italic opacity-80">
                        Meet the multidisciplinary team of clinicians delivering precision dental protocols across our network.
                    </p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 h-96 shadow-sm"></div>
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="text-4xl mb-4 text-gray-300">🦷</div>
                        <h3 className="text-lg font-bold text-gray-900">No doctors found</h3>
                        <p className="text-gray-500 mt-2">Our team list is currently being updated.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {doctors.map((doc, index) => {
                            const isFemale = FEMALE_NAMES.some(n => doc.fullName.toLowerCase().includes(n));
                            const pool = isFemale ? FEMALE_IMAGES : MALE_IMAGES;
                            const idHash = doc._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const imgSrc = doc.profilePicture || pool[(idHash + index) % pool.length];

                            return (
                                <div key={doc._id} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/20 group flex flex-col h-full">
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        <img
                                            src={imgSrc}
                                            alt={doc.fullName}
                                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/80 backdrop-blur-md text-blue-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-white/20 shadow-sm">
                                                {doc.specialization?.split(' ')[0] || 'Dentist'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-none mb-1">Dr. {doc.fullName}</h3>
                                            <p className="text-[11px] text-slate-400 font-medium italic line-clamp-2">
                                                {getBio(doc)}
                                            </p>
                                        </div>

                                        <Link
                                            to="/booking"
                                            className="w-full py-2.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-600 hover:text-white transition-all text-center block active:scale-95"
                                        >
                                            Consultation
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Careers Section - Simpler */}
            <section className="container max-w-5xl mx-auto px-4 mb-20">
                <div className="bg-slate-900 rounded-xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl -mr-32 -mt-32 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Talent Acquisition</div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-none">Join Our Faculty.</h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium italic opacity-80 leading-relaxed">
                            We are recruiting specialized dental clinicians to expand our modern care ecosystem.
                        </p>
                        <a
                            href="mailto:careers@dentalign.com"
                            className="inline-block px-10 py-5 bg-white text-slate-900 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            Submit Credentials
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DoctorsPage;
