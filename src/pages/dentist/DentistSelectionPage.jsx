import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const MALE_IMAGES = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1622902046580-2b47f47f0871?auto=format&fit=crop&q=80&w=400',
];
const FEMALE_IMAGES = [
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
];
const FEMALE_NAMES = ['sarah', 'aqeela', 'shara', 'mivchal', 'jane', 'alice', 'fatima'];

const DentistSelectionPage = () => {
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/dentists`)
            .then(({ data }) => setDentists(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (dentistId) => {
        localStorage.setItem('selectedDentistId', dentistId);
        navigate('/dentist/dashboard');
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-12 sm:py-24">
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Clinical Portal Access
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-4 uppercase">
                        Choose Your <br/><span className="text-blue-600">Specialist Profile.</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Selective entry for digital schedule management</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dentists.map((doc, idx) => {
                            const isFemale = FEMALE_NAMES.some(n => doc.fullName.toLowerCase().includes(n));
                            const pool = isFemale ? FEMALE_IMAGES : MALE_IMAGES;
                            const imgSrc = doc.profilePicture || pool[idx % pool.length];

                            return (
                                <button
                                    key={doc._id}
                                    onClick={() => handleSelect(doc._id)}
                                    className="group relative bg-white border border-slate-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center"
                                >
                                    {/* Avatar Holder */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-50 mb-6 group-hover:border-blue-200 transition-colors shadow-inner">
                                        <img src={imgSrc} alt={doc.fullName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    </div>

                                    <div className="text-center space-y-1">
                                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{doc.specialization || 'Clinical Faculty'}</div>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-blue-600 transition-colors">Dr. {doc.fullName}</h2>
                                        <p className="text-[10px] text-slate-400 font-bold italic pt-2">Enter Portal →</p>
                                    </div>

                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 rounded-3xl bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none"></div>
                                </button>
                            );
                        })}
                    </div>
                )}
                
                <div className="mt-16 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Secured Single Clinic Access</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Database Connection</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DentistSelectionPage;
