import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        const { data } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      <Header />
      <main className="max-w-5xl mx-auto p-6 min-h-[60vh]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">My Appointments</h1>
          <div className="text-sm text-gray-500">Manage upcoming and past visits</div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading appointments...</div>
          ) : appointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {appointments.map(app => (
                <div key={app._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#111827] text-lg">{app.reason}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                        {new Date(app.date) >= new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-400">
                      {new Date(app.date).toLocaleDateString()} at {app.time}
                    </div>
                    <div className="text-xs font-bold text-gray-500 mt-1">
                      With Dr. {app.dentist?.fullName || 'Assigned Dentist'}
                    </div>
                  </div>
                  <div className="text-right">
                    {new Date(app.date) >= new Date() && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this appointment?')) {
                            try {
                              const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                              const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                              await axios.put(`http://localhost:5000/api/appointments/${app._id}`, { status: 'cancelled' }, config);
                              setAppointments(appointments.filter(a => a._id !== app._id));
                              alert('Appointment cancelled successfully');
                            } catch (error) {
                              console.error('Cancel Error:', error);
                              alert('Failed to cancel appointment');
                            }
                          }
                        }}
                        className="text-red-500 text-xs font-bold hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-bold text-[#111827]">No Appointments Found</h3>
              <p className="text-gray-400 text-sm mt-2">You haven't booked any appointments yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAppointments;
