import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffBilling = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending');
    const [showPaymentModal, setShowPaymentModal] = useState({ show: false, invoiceId: null, amount: 0, title: '', type: 'treatment' });
    const [processingPayment, setProcessingPayment] = useState(false);

    const fetchBillingData = useCallback(async () => {
        if (!user?.token) { navigate('/login'); return; }
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [treatmentsRes, appointmentsRes] = await Promise.allSettled([
                axios.get(`${API_BASE_URL}/api/treatments/all`, config),
                axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config)
            ]);

            const treatmentInvoices = (treatmentsRes.status === 'fulfilled' ? treatmentsRes.value.data : []).map(t => ({
                _id: t._id,
                type: 'treatment',
                patient: t.patient,
                dentist: t.dentist,
                title: t.title || 'Treatment Fee',
                cost: t.cost || 0,
                paid: t.paid || false,
                paymentMethod: t.paymentMethod || null,
                date: t.date || t.createdAt,
            }));

            const apptData = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value.data : [];
            const bookingFeeInvoices = apptData
                .filter(a => a.status !== 'cancelled')
                .map(a => ({
                    _id: a._id,
                    type: 'booking_fee',
                    patient: a.patient,
                    dentist: a.dentist,
                    title: `Booking Fee: ${a.reason || a.serviceName || 'Consultation'}`,
                    serviceDetail: `${new Date(a.date).toLocaleDateString()} @ ${a.time}`,
                    cost: a.bookingFee || 500,
                    paid: a.isFeePaid || false,
                    paymentMethod: a.isFeePaid ? 'Card' : null,
                    date: a.date,
                }));

            const combined = [...treatmentInvoices, ...bookingFeeInvoices].sort((a, b) => {
                if (a.paid !== b.paid) return a.paid ? 1 : -1;
                return new Date(b.date) - new Date(a.date);
            });

            setInvoices(combined);
        } catch (err) {
            setError('Failed to load financial records.');
        } finally {
            setLoading(false);
        }
    }, [user?.token, navigate]);

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    const handlePayment = async (method) => {
        setProcessingPayment(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' } };
            const { invoiceId, type } = showPaymentModal;

            if (type === 'treatment') {
                await axios.patch(`${API_BASE_URL}/api/treatments/${invoiceId}/pay`, { paymentMethod: method }, config);
            } else {
                await axios.put(`${API_BASE_URL}/api/appointments/${invoiceId}`, { isFeePaid: true }, config);
            }

            setInvoices(prev => prev.map(inv =>
                inv._id === invoiceId ? { ...inv, paid: true, paymentMethod: method } : inv
            ));
            setShowPaymentModal({ show: false, invoiceId: null, amount: 0, title: '', type: 'treatment' });
        } catch (err) {
            alert('Payment failed. Please retry.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handlePrint = (inv) => {
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head><title>Receipt - ${inv._id.slice(-6).toUpperCase()}</title>
                <style>body{font-family:sans-serif;padding:40px;color:#333;max-width:600px;margin:0 auto;}.header{text-align:center;border-bottom:1px solid #ddd;padding-bottom:20px;margin-bottom:20px;}.info{display:flex;justify-content:space-between;margin:20px 0;font-size:14px;}.table{width:100%;border-collapse:collapse;margin-top:20px;}.table th{background:#f4f4f4;padding:10px;text-align:left;}.table td{border-bottom:1px solid #eee;padding:10px;}.total{text-align:right;font-size:1.2em;font-weight:bold;margin-top:20px;padding:10px;background:#f9f9f9;}</style></head>
                <body>
                    <div class="header"><h1>DENTAL ALIGN</h1><p>Patient Receipt</p></div>
                    <div class="info">
                        <div><strong>Patient:</strong> ${inv.patient?.fullName}<br><strong>ID:</strong> ${inv.patient?.patientId || 'N/A'}</div>
                        <div style="text-align:right"><strong>Date:</strong> ${new Date().toLocaleDateString()}<br><strong>Ref:</strong> ${inv._id.slice(-6).toUpperCase()}</div>
                    </div>
                    <table class="table"><thead><tr><th>Service</th><th>Description</th><th>Amount</th></tr></thead>
                    <tbody><tr><td>${inv.title}</td><td>${inv.serviceDetail || 'Procedure'}</td><td>Rs. ${inv.cost.toLocaleString()}</td></tr></tbody></table>
                    <div class="total">Total Paid: Rs. ${inv.cost.toLocaleString()}</div>
                    <p>Method: ${inv.paymentMethod || 'N/A'}</p>
                    <div style="text-align:center;margin-top:40px;color:#888;font-size:12px;">Computer Generated Receipt</div>
                    <script>window.onload=function(){window.print();}</script>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
    };

    const filteredInvoices = invoices.filter(inv => {
        if (filter === 'all') return true;
        return filter === 'pending' ? !inv.paid : inv.paid;
    });

    const stats = {
        pendingAmount: invoices.filter(i => !i.paid).reduce((sum, inv) => sum + (inv.cost || 0), 0),
        collected: invoices.filter(i => i.paid).reduce((sum, inv) => sum + (inv.cost || 0), 0),
        count: invoices.filter(i => !i.paid).length
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <header className="mb-12 border-b border-slate-200 pb-10 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                            Financial Ledger
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                            Revenue <span className="text-blue-600">Operations</span>
                        </h1>
                        <p className="mt-4 text-sm font-medium text-slate-500 max-w-xl italic opacity-80">
                            Centralized collection tracking for clinical procedures and institutional booking fees.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:min-w-[400px]">
                        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Outstanding</p>
                            <p className="text-xl font-black text-orange-600 tracking-tighter">Rs. {stats.pendingAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Collected Total</p>
                            <p className="text-xl font-black text-emerald-600 tracking-tighter">Rs. {stats.collected.toLocaleString()}</p>
                        </div>
                    </div>
                </header>

                <div className="flex bg-slate-100 p-1.5 rounded-lg w-full sm:w-fit mb-12 border border-slate-200">
                    {['pending', 'completed', 'all'].map(k => (
                        <button
                            key={k}
                            onClick={() => setFilter(k)}
                            className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded transition-all ${filter === k ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-50'}`}
                        >
                            {k === 'pending' ? `Outstanding (${stats.count})` : k}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredInvoices.length > 0 ? filteredInvoices.map(inv => (
                        <div key={inv._id} className="bg-white rounded border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all group relative">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 group-hover:text-blue-600 transition-opacity">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M7 7h10M7 12h10M7 17h10"></path></svg>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded border border-slate-100 flex items-center justify-center font-black text-[10px] tracking-tighter">
                                        ID-{inv._id.slice(-4).toUpperCase()}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${inv.paid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {inv.paid ? 'Settled' : 'Unpaid'}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 truncate tracking-tight uppercase mb-1">{inv.patient?.fullName || 'Walk-in Registry'}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date: {new Date(inv.date).toLocaleDateString()}</p>
                                
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 opacity-80">{inv.title}</p>
                                    <p className="text-[9px] text-slate-500 italic font-medium leading-relaxed">{inv.type === 'treatment' ? 'Clinical Procedure Fee' : 'Faculty Appointment Deposit'}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-end justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Amount Due</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">Rs. {inv.cost.toLocaleString()}</p>
                                </div>
                                {inv.paid ? (
                                    <button onClick={() => handlePrint(inv)} className="bg-slate-50 text-slate-900 px-4 py-2 rounded border border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                        Receipt
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowPaymentModal({ show: true, invoiceId: inv._id, amount: inv.cost, title: inv.title, type: inv.type })}
                                        className="bg-blue-600 text-white px-6 py-3 rounded text-[9px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                                    >
                                        Settle
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-32 text-center bg-white border border-slate-200 border-dashed rounded opacity-60">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.5 1M12 8V7m0 11v1m0-1c-1.11 0-2.08-.407-2.5-1M12 18v1m4-18H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path></svg>
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Clinical Ledger Empty</h3>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">No financial records detected for the selected filter.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Clean Professional Modal */}
            {showPaymentModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !processingPayment && setShowPaymentModal({ show: false })}></div>
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-60 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Record Payment</h3>
                            <button onClick={() => setShowPaymentModal({ show: false })} className="text-slate-400 hover:text-slate-900 font-bold px-2">✕</button>
                        </div>
                        
                        <div className="p-8 text-center bg-slate-900 text-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payable Amount</p>
                            <p className="text-4xl font-bold">Rs. {showPaymentModal.amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 mt-2 font-medium truncate opacity-80 px-4">{showPaymentModal.title}</p>
                        </div>

                        <div className="p-6 space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Select Payment Method</p>
                            {['Cash', 'Card Payment', 'Bank Transfer'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => handlePayment(m)}
                                    disabled={processingPayment}
                                    className="w-full py-4 px-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-between group transition-all"
                                >
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{m}</span>
                                    {processingPayment ? (
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffBilling;
