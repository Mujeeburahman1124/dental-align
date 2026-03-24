import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const DentistDashboard = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('userInfo')) || {};
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dentists, setDentists] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState(
    localStorage.getItem('selectedDentistId') || loggedInUser._id || ''
  );
  const [selectedDentistObj, setSelectedDentistObj] = useState(null);

  useEffect(() => {
    if (selectedDentistId) localStorage.setItem('selectedDentistId', selectedDentistId);
  }, [selectedDentistId]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users/dentists`)
      .then(({ data }) => {
        setDentists(data);
        const savedId = localStorage.getItem('selectedDentistId');
        if (!data.some(d => d._id === savedId) && data.length > 0) {
          setSelectedDentistId(data[0]._id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (dentists.length > 0 && selectedDentistId) {
      setSelectedDentistObj(dentists.find(d => d._id === selectedDentistId) || null);
    }
  }, [dentists, selectedDentistId]);

  useEffect(() => {
    if (!selectedDentistId || !loggedInUser.token) return;
    
    const fetchData = () => {
      const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
      Promise.all([
        axios.get(`${API_BASE_URL}/api/appointments/dentist/${selectedDentistId}`, config),
        axios.get(`${API_BASE_URL}/api/treatments/dentist/${selectedDentistId}`, config).catch(() => ({ data: [] }))
      ]).then(([apptRes, treatRes]) => {
        setAppointments(apptRes.data);
        setTreatments(treatRes.data);
      }).catch(console.error).finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [selectedDentistId, loggedInUser.token]);

  const getLocalToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalToday();
  const todayAppts = appointments.filter(a => {
    if (!a.date) return false;
    return a.date.split('T')[0] === today && a.status !== 'cancelled' && a.status !== 'completed';
  });
  
  const totalPatients = [...new Set(appointments.map(a => a.patient?._id).filter(Boolean))].length;
  const totalEarnings = treatments.reduce((sum, t) => sum + (t.doctorFee || (t.cost * 0.40)), 0);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
      await axios.put(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, { status: newStatus }, config);
      const { data } = await axios.get(`${API_BASE_URL}/api/appointments/dentist/${selectedDentistId}`, config);
      setAppointments(data);
    } catch {
      alert('Failed to update appointment status.');
    }
  };

  if (loading && appointments.length === 0) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none truncate">
              Welcome back, Dr. {selectedDentistObj?.fullName?.split(' ').slice(-1)[0] || 'Dentist'}
            </h1>
            <p className="text-sm font-medium text-slate-500">
               {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {dentists.length > 1 && (
              <div className="relative">
                <select
                  value={selectedDentistId}
                  onChange={e => setSelectedDentistId(e.target.value)}
                  className="w-full sm:w-64 pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer uppercase tracking-wider shadow-sm transition-all hover:bg-slate-50"
                >
                  {dentists.map(d => (
                    <option key={d._id} value={d._id}>Dr. {d.fullName}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
            )}
            <button
              onClick={() => navigate('/dentist/calendar')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Schedule
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: "Pending Today", val: todayAppts.length, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: "Total Patients", val: totalPatients, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: "Net Earnings", val: `Rs. ${totalEarnings.toLocaleString()}`, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded flex items-center justify-center shrink-0 border border-slate-200`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-none">{stat.val}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { to: '/dentist/treatment-record', label: 'Treatments', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>, color: "text-blue-600", bg: "bg-blue-50" },
            { to: '/dentist/prescriptions', label: 'E-Rx', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.5 20.5l-6-6a4.24 4.24 0 0 1 6-6l6 6a4.24 4.24 0 0 1-6 6z"></path><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line></svg>, color: "text-rose-600", bg: "bg-rose-50" },
            { to: '/dentist/calendar', label: 'Registry', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, color: "text-amber-600", bg: "bg-amber-50" },
            { to: '/dentist/settings', label: 'Profile', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, color: "text-slate-600", bg: "bg-slate-100" }
          ].map((btn, i) => (
            <button
              key={i}
              onClick={() => navigate(btn.to)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center gap-2 group shadow-sm active:scale-95"
            >
              <div className={`w-10 h-10 ${btn.bg} ${btn.color} rounded flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform mb-1`}>{btn.icon}</div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Today's Appointment Log</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Sync</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {todayAppts.length === 0 ? (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Zero Activity</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium italic opacity-70">Schedule clear for current date.</p>
              </div>
            ) : (
              todayAppts.sort((a, b) => new Date(a.date) - new Date(b.date)).map(appt => (
                <div key={appt._id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-lg border border-slate-200 uppercase">
                        {appt.patient?.fullName?.[0] || 'P'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{appt.patient?.fullName || 'Walk-in'}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-blue-600 uppercase">ID: {appt.patient?.patientId || 'NEW'}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">● {appt.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${
                        appt.status === 'in-treatment' ? 'bg-blue-600 text-white border-blue-600' :
                        appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {appt.status}
                      </span>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        {appt.status !== 'in-treatment' ? (
                          <button
                            onClick={() => handleUpdateStatus(appt._id, 'in-treatment')}
                            className="flex-1 sm:flex-none px-5 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-bold border border-slate-900 hover:bg-blue-600 hover:border-blue-600 transition-all uppercase tracking-widest active:scale-95"
                          >
                            Init Treatment
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => navigate('/dentist/treatment-record', { state: { patientId: appt.patient?._id } })}
                              className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-bold border border-blue-600 hover:bg-blue-700 transition-all uppercase tracking-widest shadow-sm active:scale-95"
                            >
                              Update Ledger
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'completed')}
                              className="flex-1 sm:flex-none px-5 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg text-[9px] font-bold hover:bg-emerald-50 transition-all uppercase tracking-widest active:scale-95"
                            >
                              Finalize
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DentistDashboard;
