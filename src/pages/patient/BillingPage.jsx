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

            await axios.post(`${API_BASE_URL}/api/payments`, paymentData, config);
            setPaymentSuccess(true);
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setSelectedItem(null);
                fetchData();
            }, 2000);
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed. Please try again.');
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
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
                {/* Header - Compact */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900">Billing</h1>
                        <p className="text-sm text-gray-600">Manage your payments</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-xl border border-gray-200">
                        <div className="text-xs font-bold text-gray-500">Total Due</div>
                        <div className="text-2xl font-black text-orange-600">Rs. {totalOutstanding.toLocaleString()}</div>
                    </div>
                </div>

                {/* Tabs - Compact */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            History
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === 'pending' ? (
                            <div className="space-y-4">
                                {/* Booking Fees */}
                                {unpaidAppointments.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-2">Booking Fees</h3>
                                        {unpaidAppointments.map(appt => (
                                            <div key={appt._id} className="bg-gray-50 rounded-xl p-4 mb-2">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-gray-900">{appt.reason}</div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {new Date(appt.date).toLocaleDateString()} at {appt.time}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-sm text-gray-900">Rs. {(appt.bookingFee || 500).toLocaleString()}</div>
                                                        <button
                                                            onClick={() => handleOpenPayment(appt, 'booking_fee')}
                                                            className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                                                        >
                                                            Pay
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Treatment Costs */}
                                {unpaidTreatments.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-2">Treatment Costs</h3>
                                        {unpaidTreatments.map(treat => (
                                            <div key={treat._id} className="bg-gray-50 rounded-xl p-4 mb-2">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-gray-900">{treat.title}</div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {new Date(treat.date).toLocaleDateString()} • Dr. {treat.dentist?.fullName}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-sm text-gray-900">Rs. {treat.cost.toLocaleString()}</div>
                                                        <button
                                                            onClick={() => handleOpenPayment(treat, 'treatment_fee')}
                                                            className="mt-2 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold"
                                                        >
                                                            Pay
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {unpaidAppointments.length === 0 && unpaidTreatments.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-3">✅</div>
                                        <p className="text-sm">No pending payments</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {paymentHistory.length > 0 ? paymentHistory.map(pay => (
                                    <div key={pay._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">✓</div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">
                                                    {pay.paymentType === 'booking_fee' ? 'Booking Fee' : 'Treatment'}
                                                </div>
                                                <div className="text-xs text-gray-600">{new Date(pay.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-green-600">Rs. {pay.amount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">#{pay.transactionId}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-3">📜</div>
                                        <p className="text-sm">No payment history</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal - Compact */}
            {showPaymentModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        {!paymentSuccess ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">Payment</h2>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {paymentType === 'booking_fee' ? 'Booking Fee' : 'Treatment Cost'}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Description:</span>
                                        <span className="font-bold text-gray-900">{paymentType === 'booking_fee' ? selectedItem.reason : selectedItem.title}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Patient:</span>
                                        <span className="font-bold text-gray-900">{user.fullName}</span>
                                    </div>
                                    <div className="h-px bg-gray-200"></div>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total:</span>
                                        <span className="text-2xl font-black text-blue-600">
                                            Rs. {paymentType === 'booking_fee' ? (selectedItem.bookingFee || 500).toLocaleString() : selectedItem.cost?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="MM/YY" className="px-4 py-3 rounded-lg border-2 border-gray-200 text-sm" />
                                        <input type="password" placeholder="CVC" className="px-4 py-3 rounded-lg border-2 border-gray-200 text-sm" />
                                    </div>
                                </div>

                                <button
                                    onClick={processPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Pay Now'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Complete!</h2>
                                <p className="text-sm text-gray-600">Your payment was successful</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;
