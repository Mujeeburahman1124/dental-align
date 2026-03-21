import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const BalancePage = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!user.token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch summary and payment history in parallel
            const [summaryRes, paymentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/payments/summary`, config),
                axios.get(`${API_BASE_URL}/api/payments/my-payments`, config)
            ]);

            setSummary(summaryRes.data);
            setPayments(paymentsRes.data);
        } catch (err) {
            console.error('Error fetching billing data:', err);
            setError('Failed to sync financial records. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10 font-sans">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Synchronizing Ledger...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 lg:pb-12">
            <Navbar />
            
            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">⚠️</span>
                            <div className="text-sm font-bold uppercase tracking-wider">{error}</div>
                        </div>
                        <button onClick={fetchData} className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all">Retry</button>
                    </div>
                )}

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Balance</h1>
                        <p className="text-sm text-gray-500 font-medium tracking-tight">Manage your clinical invoices and transaction history.</p>
                    </div>
                    <div className="flex justify-center gap-3">
                        <Link to="/booking" className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg active:scale-95">
                            Book Scan
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Summary Card */}
                    <section className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                            </div>
                            
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Outstanding Balance</div>
                            <div className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                                <span className="text-lg text-gray-400 mr-1 font-bold">Rs.</span>
                                {summary?.outstandingBalance?.toLocaleString() || '0'}
                            </div>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                Includes {summary?.unpaidCount || 0} pending clinical records and booking fees.
                            </p>
                            
                            {(summary?.outstandingBalance > 0) && (
                                <button className="mt-8 w-full bg-[#10B981] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-emerald-50 active:scale-95">
                                    Settle Dues
                                </button>
                            )}
                        </div>

                        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-50">
                            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em] mb-4 text-center lg:text-left">Lifetime Commitment</div>
                            <div className="text-3xl font-black tracking-tight mb-1 text-center lg:text-left">
                                <span className="text-lg text-blue-200 mr-1 font-bold">Rs.</span>
                                {summary?.totalSpent?.toLocaleString() || '0'}
                            </div>
                            <div className="text-[10px] font-bold text-blue-100 tracking-wider text-center lg:text-left uppercase">Total Invested in Smile</div>
                        </div>
                    </section>

                    {/* History Card */}
                    <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                        <header className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                Transaction Ledger
                            </h3>
                            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Download Statements</button>
                        </header>
                        
                        <div className="divide-y divide-gray-50">
                            {payments.length > 0 ? payments.map(pay => (
                                <div key={pay._id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-gray-100 italic font-serif">
                                            {pay.paymentType === 'booking_fee' ? 'B' : 'T'}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-gray-900 text-sm">{pay.appointment?.reason || pay.treatment?.title || 'Clinical Service'}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                {pay.transactionId} <span className="text-gray-200">•</span> {new Date(pay.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                        <div className="font-black text-gray-900 text-base tracking-tight">Rs. {pay.amount.toLocaleString()}</div>
                                        <div className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded border border-emerald-100">
                                            Success
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <div className="text-4xl">🧾</div>
                                    <p className="text-sm text-gray-400 font-medium">No archived payments found. Your transaction history will populate as clinical dues are settled.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default BalancePage;
