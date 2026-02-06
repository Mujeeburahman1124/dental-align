import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminBalance = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin User' };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const recentTransactions = [
    { id: 1, type: 'Income', desc: 'Patient Payment - #7821', amount: 4500, date: 'Today', status: 'Cleared' },
    { id: 2, type: 'Expense', desc: 'Dental Supplies Restock', amount: -12500, date: 'Yesterday', status: 'Pending' },
    { id: 3, type: 'Income', desc: 'Insurance Claim #3902', amount: 28000, date: 'Oct 24', status: 'Cleared' },
    { id: 4, type: 'Expense', desc: 'Utility Bill - Electricity', amount: -8500, date: 'Oct 22', status: 'Cleared' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-2xl">🦷</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">DentAlign</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 font-medium">Clinic Administration</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <span className="text-lg">📊</span>
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>
          <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <span className="text-lg">📈</span>
            <span className="font-semibold text-sm">Reports & Analytics</span>
          </Link>
          <Link to="/admin/balance" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-md transition-all">
            <span className="text-lg">💰</span>
            <span className="font-semibold text-sm">Financial Overview</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <span className="text-lg">👥</span>
            <span className="font-semibold text-sm">User Management</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <span className="text-lg">⚙️</span>
            <span className="font-semibold text-sm">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors text-left flex items-center gap-2">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <Link to="/admin/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Financial Ledger</h1>
          <p className="text-gray-500 text-sm mt-1">Manage clinic income, expenses, and invoices.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm font-semibold text-gray-500 mb-1">Total Balance</div>
            <div className="text-3xl font-bold text-gray-900">Rs. 450,200</div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+Rs. 12k Today</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm font-semibold text-gray-500 mb-1">Monthly Expenses</div>
            <div className="text-3xl font-bold text-gray-900">Rs. 82,000</div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">Supplies & Utilities</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm font-semibold text-gray-500 mb-1">Net Profit</div>
            <div className="text-3xl font-bold text-green-600">Rs. 368,200</div>
            <div className="mt-4 text-xs font-semibold text-gray-400">Current Month</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Export Report</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-sm">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{t.desc}</div>
                    <div className="text-xs text-gray-500">{t.type}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'Cleared' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.amount > 0 ? '+' : ''}Rs. {Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminBalance;
