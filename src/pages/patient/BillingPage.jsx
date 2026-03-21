import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const BillingPage = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Patient', _id: '0000' };
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [paymentType, setPaymentType] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [unpaidAppointments, setUnpaidAppointments] = useState([]);
    const [unpaidTreatments, setUnpaidTreatments] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [resAppt, resTreat, resHistory] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config),
                axios.get(`${API_BASE_URL}/api/treatments/my-treatments`, config),
                axios.get(`${API_BASE_URL}/api/payments/my-payments`, config)
            ]);

            setUnpaidAppointments(resAppt.data.filter(a => !a.isFeePaid && a.status !== 'cancelled'));
            setUnpaidTreatments(resTreat.data.filter(t => !t.paid));
            setPaymentHistory(resHistory.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const handleOpenPayment = (item, type) => {
        setSelectedItem(item);
        setPaymentType(type);
        setSelectedMethod('');
        setShowPaymentModal(true);
    };

    const processPayment = async () => {
        setIsProcessing(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const amount = paymentType === 'booking_fee' ? (selectedItem.bookingFee || 500) : selectedItem.cost;

            const requestBody = {
                amount,
                paymentType,
                paymentMethod: selectedMethod || 'Card Payment'
            };

            if (paymentType === 'booking_fee') {
                requestBody.appointmentId = selectedItem._id;
            } else {
                requestBody.treatmentId = selectedItem._id;
            }

            await axios.post(`${API_BASE_URL}/api/payments`, requestBody, config);
            setPaymentSuccess(true);
            fetchData();

            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setSelectedItem(null);
            }, 3000);

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Financial authorization failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const totalOutstanding = unpaidAppointments.reduce((acc, curr) => acc + (curr.bookingFee || 500), 0) +
        unpaidTreatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <header className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 sm:pb-8">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
                            Billing Portal
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Ledger Overview</h1>
                    </div>
                    <div className="bg-white px-5 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between md:justify-end gap-6 w-full md:w-auto self-center md:self-auto">
                        <div className="text-left md:text-right">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Total Payable</div>
                            <div className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight leading-none">Rs. {totalOutstanding.toLocaleString()}</div>
                        </div>
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-lg shrink-0">💰</div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <div className="flex border-b border-gray-50 p-1 bg-gray-50/50">
                        {['pending', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8 min-w-0">
                        {activeTab === 'pending' ? (
                            <div className="space-y-10 sm:space-y-12">
                                {/* Booking Fees Section */}
                                {unpaidAppointments.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Appointment Fees</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {unpaidAppointments.map(appt => (
                                                <div key={appt._id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-200 transition-all shadow-sm">
                                                    <div className="space-y-0.5 min-w-0 flex-1">
                                                        <div className="text-sm font-bold text-gray-900 truncate tracking-tight">{appt.reason}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                            {new Date(appt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {appt.time}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                                                        <div className="text-base font-bold text-gray-900">Rs. {(appt.bookingFee || 500).toLocaleString()}</div>
                                                        <button
                                                            onClick={() => handleOpenPayment(appt, 'booking_fee')}
                                                            className="px-4 py-2 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all active:scale-95"
                                                        >
                                                            Settle
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Treatment Cost Section */}
                                {unpaidTreatments.length > 0 && (
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-5 bg-emerald-600 rounded-full"></div>
                                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Treatment Bills</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {unpaidTreatments.map(treat => (
                                                <div key={treat._id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition-all shadow-sm">
                                                    <div className="space-y-0.5 min-w-0 flex-1">
                                                        <div className="text-sm font-bold text-gray-900 truncate tracking-tight">{treat.title}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Dr. {treat.dentist?.fullName?.split(' ').slice(-1)[0]}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                                                        <div className="text-base font-bold text-gray-900">Rs. {treat.cost.toLocaleString()}</div>
                                                        <button
                                                            onClick={() => handleOpenPayment(treat, 'treatment_fee')}
                                                            className="px-4 py-2 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all active:scale-95"
                                                        >
                                                            Settle
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {unpaidAppointments.length === 0 && unpaidTreatments.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">All Caught Up</h3>
                                        <p className="text-sm text-gray-500 mt-1">You have no pending payments at this time.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {paymentHistory.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {paymentHistory.map(pay => (
                                            <div key={pay._id} className="p-6 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
                                                <div className="flex justify-between items-start mb-6 relative z-10">
                                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</div>
                                                        <div className="text-[11px] font-bold text-gray-900">{new Date(pay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                    </div>
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{pay.paymentType === 'booking_fee' ? 'Clinic Fee' : 'Treatment'}</div>
                                                    <div className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Rs. {pay.amount.toLocaleString()}</div>
                                                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID Log</span>
                                                        <span className="text-[9px] font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{pay.transactionId?.slice(-6).toUpperCase() || 'TX-XXXX'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                                            <span className="text-3xl grayscale opacity-50">🧾</span>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-2">No Statements Found</h3>
                                        <p className="text-xs text-gray-400 font-medium italic">Your completed transactions will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Payment Modal */}
            {showPaymentModal && selectedItem && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden border border-gray-100">
                        {!paymentSuccess ? (
                            <div className="p-6 sm:p-8 space-y-6">
                                <header className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                            <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                            Secure Session
                                        </p>
                                    </div>
                                    <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </header>

                                {/* Item Summary */}
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-tight truncate mr-4">
                                        {paymentType === 'booking_fee' ? 'Appointment Fee' : selectedItem.title}
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 shrink-0">
                                        Rs. {(paymentType === 'booking_fee' ? (selectedItem.bookingFee || 500) : selectedItem.cost).toLocaleString()}
                                    </div>
                                </div>

                                {/* Method Selection Overlay */}
                                {!selectedMethod ? (
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Payment Method</div>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {[
                                                { id: 'Card Payment', label: 'Card Payment', icon: '💳' },
                                                { id: 'Online Payment', label: 'Online Payment', icon: '📱' },
                                                { id: 'Direct Payment', label: 'Direct Payment', icon: '🏦' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSelectedMethod(opt.id)}
                                                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-[0.98]"
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-xl">{opt.icon}</div>
                                                    <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">{opt.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {selectedMethod === 'Card Payment' ? (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cardholder</label>
                                                    <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm" defaultValue={user.fullName} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                                                    <input type="text" maxLength="19" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm" />
                                                    <input type="password" placeholder="CVV" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center space-y-3 bg-blue-50/50 rounded-2xl border border-blue-50">
                                                <div className="text-3xl">{selectedMethod === 'Online Payment' ? '📱' : '🏦'}</div>
                                                <div className="text-xs font-bold text-gray-900 uppercase">Confirm {selectedMethod}</div>
                                                <p className="text-[10px] text-gray-500 px-6 italic">You will be redirected for verification.</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                onClick={() => setSelectedMethod('')}
                                                className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-gray-900 transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={processPayment}
                                                disabled={isProcessing}
                                                className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-2 flex items-center justify-center gap-4 opacity-30 grayscale pointer-events-none">
                                    <span className="text-[7px] font-bold uppercase">VISA</span>
                                    <span className="text-[7px] font-bold uppercase">MASTERCARD</span>
                                    <span className="text-[7px] font-bold uppercase">SECURE SSL</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-10 text-center space-y-6">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">✓</div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-gray-900">Payment Verified</h2>
                                    <p className="text-[10px] text-gray-400 uppercase font-medium">Receipt has been logged.</p>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} className="w-full py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all active:scale-95">Done</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;
