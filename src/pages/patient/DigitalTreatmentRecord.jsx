import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const DigitalTreatmentRecord = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` }
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/treatments/my-treatments`, config);
        setTreatments(data);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.token) {
      fetchTreatments();
    } else {
      setLoading(false);
    }
  }, [user.token]);

  // Transform backend data to timeline format if needed, or use directly
  // Backend returns: { _id, title, dentist: { fullName }, date, status(we don't have this, assume completed?), cost, paid, procedures... }

  const dentalHistory = {
    allergies: [], // Backend doesn't support yet, showing empty
    medicalConditions: [],
    previousTreatments: [], // Removed hardcoded
    teethChart: [] // Removed hardcoded
  };

  const getStatusColor = (status) => {
    // Basic mapping since backend doesn't seem to have 'status' field in TreatmentRecord model explicitly visible in snippets, 
    // but seeded data might. Defaulting to 'completed' style if not present or mapping appropriately.
    return 'bg-green-50 text-green-600 border-green-200';
  };

  const getTypeIcon = (title) => {
    if (title.toLowerCase().includes('checkup')) return '🔍';
    if (title.toLowerCase().includes('consultation')) return '💬';
    return '🦷';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-8 font-inter">
      <div className="bg-white w-full max-w-[1440px] flex rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-50 flex flex-col h-full bg-white">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#111827]">DentAlign</span>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Treatment Records</div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link to="/patient/dashboard" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <span className="text-xl">📊</span>Dashboard
            </Link>
            <Link to="/patient/appointments" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <span className="text-xl">📅</span>Appointments
            </Link>
            <Link to="/patient/records" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold bg-[#007AFF]/10 text-[#007AFF] transition-all">
              <span className="text-xl">📋</span>My Records
            </Link>
            <Link to="/patient/billing" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <span className="text-xl">💳</span>Billing
            </Link>
          </nav>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-[#007AFF]">
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#111827] truncate">{user.fullName || 'Guest'}</div>
                <div className="text-[10px] font-bold text-gray-400">Patient ID: #{user._id?.slice(-4) || '----'}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
              <span>🚪</span> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto p-12 custom-scrollbar bg-white">
          <div className="max-w-[1100px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight">Digital Treatment Record</h1>
                <p className="text-gray-400 font-bold mt-2">{user.fullName} • Patient ID: #{user._id?.slice(-4) || '----'}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                  <span>📥</span> Download/Print Record
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl w-fit">
              {[
                { id: 'timeline', label: 'Timeline', icon: '📅' },
                { id: 'history', label: 'Medical History', icon: '📋' },
                { id: 'chart', label: 'Teeth Chart', icon: '🦷' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-white text-[#007AFF] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Timeline View */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-10 text-gray-400 font-bold">Loading records...</div>
                ) : treatments.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                    <div className="text-6xl mb-4 grayscale opacity-20">📂</div>
                    <h3 className="text-xl font-bold text-gray-900">No Treatment Records Found</h3>
                    <p className="text-gray-400 text-sm mt-2">Any future dental procedures will appear here.</p>
                  </div>
                ) : (
                  treatments.map((record, idx) => (
                    <div
                      key={record._id}
                      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                    >
                      {/* Timeline connector */}
                      {idx < treatments.length - 1 && (
                        <div className="absolute left-[52px] top-full w-0.5 h-6 bg-gray-200 z-10"></div>
                      )}

                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* Date Badge */}
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-blue-100">
                            <div className="text-3xl mb-1">{getTypeIcon(record.title)}</div>
                            <div className="text-xs font-bold text-[#007AFF] uppercase">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                            <div className="text-[10px] font-bold text-gray-400">{new Date(record.date).getFullYear()}</div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-[#111827]">{record.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                    👨‍⚕️ {record.dentist?.fullName || 'Dr. Unknown'}
                                  </span>
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${getStatusColor('completed')}`}>
                                    Active Record
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-[#111827]">Rs. {record.cost?.toLocaleString()}</div>
                                <div className={`text-xs font-bold ${record.paid ? 'text-green-600' : 'text-yellow-600'}`}>
                                  {record.paid ? '✓ Paid' : '○ Pending'}
                                </div>
                              </div>
                            </div>

                            {/* Procedures */}
                            {record.procedures && record.procedures.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {record.procedures.map((proc, i) => (
                                  <span key={i} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                                    {proc}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Prescriptions */}
                            {record.prescriptions && (
                              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 mb-4">
                                <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <span>💊</span> Prescriptions
                                </div>
                                <div className="text-sm font-bold text-gray-700">
                                  {record.prescriptions}
                                </div>
                              </div>
                            )}

                            {/* Notes */}
                            {record.notes && (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                  <span>📝</span> Doctor's Notes
                                </div>
                                <p className="text-sm text-gray-600">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )))}
              </div>
            )}

            {/* Medical History View */}
            {activeTab === 'history' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Known Allergies
                  </h3>
                  <div className="text-sm text-gray-500 font-bold italic">No known allergies recorded.</div>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                  <h3 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2">
                    <span>🏥</span> Medical Conditions
                  </h3>
                  <div className="text-sm text-gray-500 font-bold italic">No medical conditions recorded.</div>
                </div>

                <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                    <span>📅</span> Previous Treatment History
                  </h3>
                  <div className="text-center py-8 text-gray-400 text-sm font-bold">
                    No historical records available.
                  </div>
                </div>
              </div>
            )}

            {/* Teeth Chart View */}
            {activeTab === 'chart' && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-[#111827] mb-6 text-center">Interactive Teeth Chart</h3>

                {/* Simplified teeth representation */}
                <div className="max-w-2xl mx-auto">
                  {/* Upper teeth */}
                  <div className="mb-8">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Upper Teeth</div>
                    <div className="flex justify-center gap-2">
                      {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(tooth => (
                        <div
                          key={tooth}
                          className="w-8 h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110 bg-gray-100 text-gray-600"
                          title='Healthy'
                        >
                          {tooth}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lower teeth */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Lower Teeth</div>
                    <div className="flex justify-center gap-2">
                      {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(tooth => (
                        <div
                          key={tooth}
                          className="w-8 h-10 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110 bg-gray-100 text-gray-600"
                          title='Healthy'
                        >
                          {tooth}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Visual Chart Currently Empty
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalTreatmentRecord;
