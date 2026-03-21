import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const AdminBalance = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Admin' };
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBalance: 0, monthlyExpenses: 0, netProfit: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: allTreatments } = await axios.get(`${API_BASE_URL}/api/treatments/all`, config);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const totalRevenue = allTreatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        const totalDrPayouts = allTreatments.reduce((acc, curr) => acc + (curr.doctorFee || 0), 0);
        const staffFixedSalary = 45000;

        const monthlyRev = allTreatments
          .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((acc, curr) => acc + (curr.cost || 0), 0);

        const monthlyDrFee = allTreatments
          .filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
          .reduce((acc, curr) => acc + (curr.doctorFee || 0), 0);

        setStats({
          totalBalance: totalRevenue - totalDrPayouts - (staffFixedSalary * 12),
          monthlyExpenses: monthlyDrFee + staffFixedSalary,
          netProfit: monthlyRev - monthlyDrFee - staffFixedSalary
        });

        const combined = [
          ...allTreatments.map(t => ({
            id: `inc-${t._id}`,
            type: 'Income',
            desc: `Treatment: ${t.title} - ${t.patient?.fullName || 'Walk-in'}`,
            amount: t.cost,
            date: new Date(t.date).toLocaleDateString(),
            status: t.paid ? 'Paid' : 'Pending'
          })),
          ...allTreatments.filter(t => t.doctorFee > 0).map(t => ({
            id: `exp-${t._id}`,
            type: 'Expense',
            desc: `Dr. Payout: Dr. ${t.dentist?.fullName || 'Doctor'} (40% Service Fee)`,
            amount: -t.doctorFee,
            date: new Date(t.date).toLocaleDateString(),
            status: 'Paid'
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(combined.slice(0, 15));
      } catch (error) {
        console.error('Balance fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalanceData();
  }, [user.token]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-sm font-semibold text-gray-500">Loading Financial Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <Link to="/admin/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Financial Ledger</h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl">Clinic revenue, expenses, and doctor payouts overview.</p>
          </div>
          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download Report
            </button>
          </div>
        </header>

        {/* Global Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between items-start">
            <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center text-xl mb-4 border border-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total System Balance</div>
              <div className="text-3xl font-bold text-gray-900">Rs. {stats.totalBalance.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between items-start">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl mb-4 border border-red-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" /></svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monthly Expenses</div>
              <div className="text-3xl font-bold text-gray-900">Rs. {stats.monthlyExpenses.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1 font-medium">Payouts & Fixed Salaries</div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm flex flex-col justify-between items-start sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-xl mb-4 border border-green-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Monthly Net Profit</div>
              <div className="text-3xl font-bold text-green-900">Rs. {stats.netProfit.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Transaction Ledger Table */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm truncate max-w-[300px]" title={t.desc}>{t.desc}</div>
                        <div className="text-xs text-gray-500 mt-1">{t.date} • {t.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${t.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-bold text-sm ${t.amount > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                          {t.amount > 0 ? '+' : '-'}Rs. {Math.abs(t.amount).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-500 text-sm">No recent transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Active Payment Gateways</h3>
              <div className="space-y-3">
                {[
                  { label: 'Card Payment (Stripe)', status: 'Active', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, color: 'bg-green-50 text-green-600 border-green-200' },
                  { label: 'Bank Transfer', status: 'Ready', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, color: 'bg-blue-50 text-blue-600 border-blue-200' },
                  { label: 'Cash at Desk', status: 'Active', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>, color: 'bg-green-50 text-green-600 border-green-200' }
                ].map((gate, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                    <div className={`${gate.color} w-10 h-10 rounded-md flex items-center justify-center border bg-white`}>{gate.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{gate.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{gate.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Doctor Payouts Info</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Doctor fees are currently configured at a <span className="font-bold text-gray-900">40% fixed rate</span> for all standard procedures performed. Payouts are calculated monthly.
              </p>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-500">Next Payout Cycle:</span>
                <span className="font-bold text-gray-900">End of Month</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBalance;
