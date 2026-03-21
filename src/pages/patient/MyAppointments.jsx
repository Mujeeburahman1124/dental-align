import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          };
          const { data } = await axios.get(`${API_BASE_URL}/api/appointments/my-appointments`, config);
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (appId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`${API_BASE_URL}/api/appointments/${appId}`, { status: 'cancelled' }, config);
        setAppointments(appointments.filter(a => a._id !== appId));
        alert('Appointment has been successfully cancelled.');
      } catch (error) {
        console.error('Cancel Error:', error);
        alert('Failed to cancel the appointment. Please try again or contact the clinic.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 sm:pb-8">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-[10px] font-bold uppercase tracking-wider">
              Clinical Schedule
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Visit History</h1>
            <p className="text-xs text-gray-400 font-medium">Review your clinical engagements and past consultations.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between md:justify-end gap-6 w-full md:w-auto self-center md:self-auto shrink-0">
            <div className="text-left md:text-right">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Record Count</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{appointments.length} Sessions</div>
            </div>
            <div className="text-xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg border border-gray-100 shrink-0">📅</div>
          </div>
        </header>

        <div className="space-y-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse h-64"></div>
              ))}
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appointments.map(app => {
                const appDate = new Date(app.date);
                appDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = appDate.getTime() < today.getTime();
                const isToday = appDate.getTime() === today.getTime();
                const isUpcoming = appDate.getTime() >= today.getTime();

                let displayStatus = 'Upcoming';
                let badgeStyle = 'bg-blue-50 text-blue-600 border-blue-100';

                if (app.status === 'cancelled') {
                  displayStatus = 'Cancelled';
                  badgeStyle = 'bg-red-50 text-red-600 border-red-100';
                } else if (app.status === 'completed') {
                  displayStatus = 'Fulfilled';
                  badgeStyle = 'bg-green-50 text-green-600 border-green-100';
                } else if (isPast) {
                  if (app.status === 'in-treatment') {
                     displayStatus = 'Action Required';
                     badgeStyle = 'bg-yellow-50 text-yellow-600 border-yellow-100 animate-pulse';
                  } else {
                    displayStatus = 'Previous';
                    badgeStyle = 'bg-gray-50 text-gray-400 border-gray-100';
                  }
                } else if (isToday && app.status === 'in-treatment') {
                  displayStatus = 'In Surgery';
                  badgeStyle = 'bg-indigo-600 text-white border-transparent animate-pulse shadow-lg shadow-indigo-100';
                }

                return (
                  <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest border ${badgeStyle}`}>
                          {displayStatus}
                        </span>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          {new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-[8px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Service</div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 truncate">{app.reason}</h3>
                        <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg w-fit border border-gray-100">
                          <span className="text-xs">📍</span>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">{app.branch?.name || 'Main'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        <div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Time Slot</div>
                          <div className="text-[13px] font-bold text-gray-900">{app.time}</div>
                        </div>
                        <div>
                          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Dentist</div>
                          <div className="text-[13px] font-bold text-gray-900 truncate">Dr. {app.dentist?.fullName?.split(' ').slice(-1)[0] || 'TBA'}</div>
                        </div>
                      </div>
                    </div>

                    {isUpcoming && app.status !== 'in-treatment' && app.status !== 'cancelled' && (
                      <div className="pt-6 mt-4">
                        <button
                          onClick={() => handleCancel(app._id)}
                          className="w-full py-2.5 rounded-xl bg-white border border-red-100 text-red-600 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
                        >
                          Revoke Appointment
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 sm:p-24 rounded-[3rem] text-center border border-gray-100 shadow-xl shadow-gray-200/20 max-w-3xl mx-auto relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
              <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-gray-50 shadow-inner relative z-10">
                🦷
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 relative z-10">Empty Clinical Record</h3>
              <p className="text-sm text-gray-500 mb-10 max-w-sm mx-auto font-medium italic relative z-10">Your journey to a perfect smile hasn't started yet. Let's schedule your first consultation today.</p>
              <Link to='/booking' className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 active:scale-95">
                Start Treatment Journey
                <span className="text-lg">→</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAppointments;
