import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const BillingPage = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Patient', _id: '0000' };
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [paymentType, setPaymentType] = useState(''); // 'booking_fee' or 'treatment_fee'
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [unpaidAppointments, setUnpaidAppointments] = useState([]);
    const [unpaidTreatments, setUnpaidTreatments] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Fetch appointments with unpaid fees
            const resAppt = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
            setUnpaidAppointments(resAppt.data.filter(a => !a.isFeePaid && a.status !== 'cancelled'));

            // Fetch unpaid treatments
            const resTreat = await axios.get('http://localhost:5000/api/treatments/my-treatments', config);
            setUnpaidTreatments(resTreat.data.filter(t => !t.paid));

            // Fetch payment history
            const resHistory = await axios.get('http://localhost:5000/api/payments/my-payments', config);
            setPaymentHistory(resHistory.data);

        } catch (error) {
            console.error('Error fetching billing data:', error);
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
        setShowPaymentModal(true);
    };

    const processPayment = async () => {
        setIsProcessing(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const paymentData = {
                amount: paymentType === 'booking_fee' ? (selectedItem.bookingFee || 500) : selectedItem.cost,
                paymentType: paymentType,
                appointmentId: paymentType === 'booking_fee' ? selectedItem._id : undefined,
                treatmentId: paymentType === 'treatment_fee' ? selectedItem._id : undefined,
                paymentMethod: 'card'
            };

            await axios.post('http://localhost:5000/api/payments', paymentData, config);

            setPaymentSuccess(true);
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setSelectedItem(null);
                fetchData(); // Refresh data
            }, 2000);
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="w-10 h-10 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const totalOutstanding = unpaidAppointments.reduce((acc, curr) => acc + (curr.bookingFee || 500), 0) +
        unpaidTreatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-inter flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full p-8 lg:p-12 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#111827] tracking-tighter">Finance Hub</h1>
                        <p className="text-gray-400 font-bold mt-2">Pay for bookings and treatment records securely</p>
                    </div>
                    <div className="bg-white px-8 py-5 rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Outstanding</div>
                        <div className="text-3xl font-black text-orange-600">Rs. {totalOutstanding.toLocaleString()}</div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-50 px-8 pt-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'pending', label: 'Required Payments', icon: '💳' },
                            { id: 'history', label: 'Payment History', icon: '📜' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all border-b-4 flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'border-[#007AFF] text-[#007AFF]' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {activeTab === 'pending' ? (
                            <div className="space-y-10">
                                {/* Booking Fees Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                        <h2 className="text-xl font-black text-[#111827] tracking-tight uppercas">Pre-Treatment Booking Fees</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {unpaidAppointments.length > 0 ? unpaidAppointments.map(appt => (
                                            <div key={appt._id} className="bg-gray-50 rounded-[32px] p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">📅</div>
                                                    <div>
                                                        <div className="font-black text-[#111827]">{appt.reason}</div>
                                                        <div className="text-xs font-bold text-gray-400 mt-1">Scheduled for {new Date(appt.date).toLocaleDateString()} at {appt.time}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Fee</div>
                                                        <div className="text-xl font-black text-[#111827]">Rs. {(appt.bookingFee || 500).toLocaleString()}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenPayment(appt, 'booking_fee')}
                                                        className="bg-[#007AFF] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0066D6] shadow-lg shadow-blue-100 active:scale-95 transition-all"
                                                    >
                                                        Pay Fee
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 font-bold">No booking fees pending.</div>
                                        )}
                                    </div>
                                </section>

                                {/* Treatment Cost Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                                        <h2 className="text-xl font-black text-[#111827] tracking-tight uppercase">Post-Treatment Service Invoices</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {unpaidTreatments.length > 0 ? unpaidTreatments.map(treat => (
                                            <div key={treat._id} className="bg-gray-50 rounded-[32px] p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-orange-100">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🦷</div>
                                                    <div>
                                                        <div className="font-black text-[#111827]">{treat.title}</div>
                                                        <div className="text-xs font-bold text-gray-400 mt-1">Visit Date: {new Date(treat.date).toLocaleDateString()} • Dr. {treat.dentist?.fullName}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Treatment Cost</div>
                                                        <div className="text-xl font-black text-[#111827]">Rs. {treat.cost.toLocaleString()}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenPayment(treat, 'treatment_fee')}
                                                        className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-100 active:scale-95 transition-all"
                                                    >
                                                        Settle Bill
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 font-bold">No treatment invoices pending.</div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            /* History Tab */
                            <div className="space-y-4">
                                {paymentHistory.length > 0 ? paymentHistory.map(pay => (
                                    <div key={pay._id} className="flex justify-between items-center p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl text-green-600">✓</div>
                                            <div>
                                                <div className="font-black text-[#111827] truncate max-w-[200px] md:max-w-none">
                                                    {pay.paymentType === 'booking_fee' ? 'Booking Fee' : 'Treatment Settlement'}
                                                    <span className="text-xs text-gray-300 ml-2">#{pay.transactionId}</span>
                                                </div>
                                                <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                    Processed on {new Date(pay.date).toLocaleDateString()} • {pay.paymentMethod}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</div>
                                            <div className="text-xl font-black text-green-600">Rs. {pay.amount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center flex flex-col items-center opacity-50">
                                        <div className="text-4xl mb-4 text-gray-300">📜</div>
                                        <h3 className="text-xl font-black text-[#111827] mb-2 uppercase tracking-tight">No Payment History</h3>
                                        <p className="text-gray-400 font-bold max-w-sm mx-auto">Your processed payments will be archived here for your records.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Payment Modal */}
            {showPaymentModal && selectedItem && (
                <div className="fixed inset-0 bg-[#111827]/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-[48px] w-full max-w-xl p-12 shadow-2xl relative overflow-hidden animate-fade-in">
                        {!paymentSuccess ? (
                            <div className="space-y-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-black text-[#111827] tracking-tighter">Secure Payment</h2>
                                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                            {paymentType === 'booking_fee' ? 'Advance Consultation Fee' : 'Clinical Service Settlement'}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowPaymentModal(false)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl font-light hover:bg-gray-100 transition-all">×</button>
                                </div>

                                <div className="bg-[#F8FAFC] rounded-[32px] p-8 space-y-6">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-400">Description</span>
                                        <span className="text-[#111827] truncate max-w-[200px]">{paymentType === 'booking_fee' ? selectedItem.reason : selectedItem.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-400">Patient</span>
                                        <span className="text-[#111827]">{user.fullName}</span>
                                    </div>
                                    <div className="h-px bg-gray-200/50"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-[#111827]">Total Due</span>
                                        <span className="text-4xl font-black text-[#007AFF]">
                                            Rs. {paymentType === 'booking_fee' ? (selectedItem.bookingFee || 500).toLocaleString() : selectedItem.cost?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="relative group">
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 block pl-2">Credit / Debit Card</label>
                                            <input type="text" placeholder="XXXX XXXX XXXX 4242" className="w-full bg-gray-50 p-6 rounded-[24px] font-black text-[#111827] border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-center tracking-[0.2em] outline-none" />
                                            <div className="absolute top-1/2 left-6 translate-y-[2px] text-xl grayscale group-focus-within:grayscale-0 transition-all">💳</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="MM / YY" className="w-full bg-gray-50 p-6 rounded-[24px] font-black text-[#111827] border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-center outline-none" />
                                        <input type="password" placeholder="CVC" className="w-full bg-gray-50 p-6 rounded-[24px] font-black text-[#111827] border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-center outline-none tracking-widest" />
                                    </div>
                                </div>

                                <button
                                    onClick={processPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-[#111827] text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Authorizing...
                                        </>
                                    ) : (
                                        <>Proceed & Pay Now</>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-4 py-2 opacity-30">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png" alt="Visa" className="h-4" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                                    <div className="h-4 w-[1px] bg-gray-400"></div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PCI DSS SECURE</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-8 animate-fade-in">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto shadow-2xl shadow-green-100 animate-bounce">✓</div>
                                <h2 className="text-4xl font-black text-[#111827] tracking-tighter">Transaction Complete</h2>
                                <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">Your payment has been successfully authorized and linked to your dental records. A digital receipt is now available in your history.</p>
                                <button onClick={() => setShowPaymentModal(false)} className="bg-gray-100 text-[#111827] px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all transition-all">Dismiss Receipt</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;
