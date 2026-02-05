import React from 'react';
import { Link } from 'react-router-dom';

const BalancePage = () => {
  const invoices = [
    { id: 'INV-1001', date: '2026-01-12', type: 'Cleaning', amount: 2500, status: 'Paid' },
    { id: 'INV-1002', date: '2026-01-26', type: 'Filling', amount: 4500, status: 'Due' },
    { id: 'INV-1003', date: '2026-02-01', type: 'Consultation', amount: 1200, status: 'Paid' },
  ];

  const balanceDue = invoices.filter(i => i.status === 'Due').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-inter">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Billing & Balance</h1>
            <p className="text-sm text-gray-500">View invoices, payments and outstanding balance.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/booking" className="bg-[#007AFF] text-white px-4 py-2 rounded-lg text-sm font-bold">Book Appointment</Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Outstanding Balance</div>
            <div className="text-2xl font-extrabold mt-4">Rs. {balanceDue}</div>
            <div className="text-xs text-gray-500 mt-2">Please clear due invoices to avoid appointment blocks.</div>
            <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-xl font-bold">Pay Now</button>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-gray-600">Invoices</div>
              <div className="text-xs text-gray-400">Most recent first</div>
            </div>
            <div className="divide-y divide-gray-100">
              {invoices.map(inv => (
                <div key={inv.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold">{inv.type}</div>
                    <div className="text-xs text-gray-400">{inv.id} • {inv.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Rs. {inv.amount}</div>
                    <div className={`text-xs font-bold mt-1 ${inv.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>{inv.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Payment History</h3>
          <p className="text-sm text-gray-500">Recent payments are shown here. View full statements in clinic receipts.</p>
        </section>
      </div>
    </div>
  );
};

export default BalancePage;
