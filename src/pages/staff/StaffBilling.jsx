import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffBilling = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [showPaymentModal, setShowPaymentModal] = useState({ show: false, invoiceId: null, amount: 0, title: '' });

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        const fetchBillingData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch all treatments as invoices
                const { data } = await axios.get('http://localhost:5000/api/treatments/all', config);
                setInvoices(data);
            } catch (error) {
                console.error('Error fetching billing data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBillingData();
    }, [navigate, user]);

    const handlePayment = async (method) => {
        // Optimistic update
        // In real app: await axios.put(`/api/treatments/${showPaymentModal.invoiceId}/pay`, { method })
        const updatedInvoices = invoices.map(inv =>
            inv._id === showPaymentModal.invoiceId ? { ...inv, paid: true, paymentMethod: method } : inv
        );
        setInvoices(updatedInvoices);
        setShowPaymentModal({ show: false, invoiceId: null, amount: 0, title: '' });
        alert(`Payment of Rs. ${showPaymentModal.amount} settled via ${method}`);
    };

    const filteredInvoices = invoices.filter(inv => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !inv.paid;
        if (filter === 'completed') return inv.paid;
        return true;
    });

    const stats = {
        total: invoices.reduce((sum, inv) => sum + (inv.cost || 0), 0),
        pendingAmount: invoices.filter(i => !i.paid).reduce((sum, inv) => sum + (inv.cost || 0), 0),
        collected: invoices.filter(i => i.paid).reduce((sum, inv) => sum + (inv.cost || 0), 0)
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-inter">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#111827] tracking-tighter">Billing Console</h1>
                        <p className="text-gray-500 font-bold mt-2">Manage patient invoices and clinic revenue</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-right">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Collection</div>
                            <div className="text-2xl font-black text-orange-600">Rs. {stats.pendingAmount.toLocaleString()}</div>
                        </div>
                        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-right">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Collected</div>
                            <div className="text-2xl font-black text-green-600">Rs. {stats.collected.toLocaleString()}</div>
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl w-fit shadow-sm border border-gray-100">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${filter === 'pending' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        Pending Invoices
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${filter === 'completed' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        Settled History
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        All Records
                    </button>
                </div>

                {/* Invoices List */}
                <div className="space-y-4">
                    {filteredInvoices.length > 0 ? filteredInvoices.map(inv => (
                        <div key={inv._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${inv.paid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {inv.paid ? '✓' : '⚠️'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{inv.patient?.fullName || 'Unknown Patient'}</div>
                                        <h3 className="text-2xl font-black text-[#111827]">{inv.title}</h3>
                                        <div className="text-xs font-bold text-gray-400 mt-2 flex gap-3">
                                            <span>📅 {new Date(inv.date).toLocaleDateString()}</span>
                                            <span>👨‍⚕️ {inv.dentist?.fullName || 'Dr. Mitchell'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="text-3xl font-black text-[#111827]">
                                        Rs. {inv.cost.toLocaleString()}
                                    </div>

                                    {!inv.paid ? (
                                        <button
                                            onClick={() => setShowPaymentModal({ show: true, invoiceId: inv._id, amount: inv.cost, title: inv.title })}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            💳 Process Payment
                                        </button>
                                    ) : (
                                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                                            Settled via {inv.paymentMethod || 'Cash'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm opacity-50">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-2xl font-black text-gray-300">No invoices found</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 text-2xl">💰</div>
                            <h3 className="text-xl font-bold text-gray-900">Settle Payment</h3>
                            <p className="text-sm text-gray-500 mt-1">{showPaymentModal.title}</p>
                            <div className="text-2xl font-black text-gray-900 mt-2">Rs. {parseInt(showPaymentModal.amount).toLocaleString()}</div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handlePayment('Cash')}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <span className="font-bold text-gray-700 group-hover:text-green-700">💵 Cash Payment</span>
                                <span className="text-gray-400 group-hover:text-green-600">→</span>
                            </button>
                            <button
                                onClick={() => handlePayment('Online Transfer')}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <span className="font-bold text-gray-700 group-hover:text-blue-700">🏦 Online Transfer</span>
                                <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPaymentModal({ show: false, invoiceId: null, amount: 0, title: '' })}
                            className="w-full mt-6 py-2.5 text-gray-500 font-bold text-sm hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffBilling;
