import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const ref = searchParams.get('ref');
    const type = searchParams.get('type');
    const amt = searchParams.get('amt');
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const [transactionDetails, setTransactionDetails] = React.useState({
        id: ref || `TXN-${Math.random().toString(36).slice(-8).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        method: 'Stripe Online Payment',
        status: 'PAID'
    });

    const confirmationAttempted = React.useRef(false);

    useEffect(() => {
        const confirmPayment = async () => {
            if (confirmationAttempted.current) return;
            confirmationAttempted.current = true;

            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`${API_BASE_URL}/api/payments`, {
                    appointmentId: type === 'booking_fee' ? ref : undefined,
                    treatmentId: type === 'treatment_fee' ? ref : undefined,
                    amount: amt ? Number(amt) : (type === 'booking_fee' ? 500 : 0),
                    paymentType: type,
                    paymentMethod: 'card',
                    sessionId // Pass sessionId for idempotency
                }, config);
            } catch (error) {
                console.error('Payment Confirmation Error:', error);
            }
        };

        if (sessionId && user) {
            confirmPayment();
        }
    }, [sessionId, user, type, ref]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-12 sm:py-24 flex flex-col items-center">
                <div className="w-full bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10 sm:p-16 text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-500 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-green-100 mx-auto mb-10 transform rotate-3">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <div className="space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Payment Verified
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">Payment Successful!</h1>
                        <p className="text-sm sm:text-lg text-gray-500 font-medium max-w-md mx-auto italic">
                            Thank you for your payment. Your transaction has been completed and a receipt has been sent to your email.
                        </p>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-left space-y-8 shadow-2xl shadow-gray-200 mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>

                        <div className="flex justify-between items-end border-b border-white/10 pb-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction ID</p>
                                <p className="text-xl font-bold text-white tracking-tight">{transactionDetails.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-bold text-white uppercase">{transactionDetails.status}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date & Time</p>
                                    <p className="text-sm font-bold text-white">{transactionDetails.date} at {transactionDetails.time}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Method</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{transactionDetails.method}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-end">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Amount Paid</p>
                                <p className="text-3xl font-extrabold text-white tracking-tighter">Rs. {amt ? Number(amt).toLocaleString() : (type === 'booking_fee' ? '500' : '0')}</p>
                            </div>
                        </div>

                        <p className="text-[9px] font-bold text-gray-600 text-center uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                            Official digital receipt generated by DentAlign Clinic
                        </p>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/patient/dashboard')}
                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group"
                        >
                            Go to Dashboard
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <Link
                            to="/patient/balance"
                            className="px-10 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            View Billing History
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentSuccess;
