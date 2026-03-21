import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const DigitalTreatmentRecord = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [treatments, setTreatments] = useState([]);
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: user.allergies || [],
    medicalHistory: user.medicalHistory || []
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    allergies: '',
    medicalHistory: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      if (!user.token) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);
      setMedicalInfo({
        allergies: data.allergies || [],
        medicalHistory: data.medicalHistory || []
      });
      // Update local storage too to keep it in sync
      localStorage.setItem('userInfo', JSON.stringify({ ...user, ...data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        if (!user.token) return;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/api/treatments/my-treatments`, config);
        setTreatments(data);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
    fetchProfile();
  }, [user.token]);

  const handleEditClick = () => {
    setEditFormData({
      allergies: medicalInfo.allergies.join(', '),
      medicalHistory: medicalInfo.medicalHistory.join(', ')
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMedical = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        allergies: editFormData.allergies.split(',').map(s => s.trim()).filter(s => s !== ''),
        medicalHistory: editFormData.medicalHistory.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, payload, config);
      setMedicalInfo({
        allergies: data.allergies || [],
        medicalHistory: data.medicalHistory || []
      });
      setIsEditModalOpen(false);
      alert('Medical information updated successfully!');
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update medical information.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Treatment History - ${user.fullName}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .section { margin-bottom: 30px; }
            .section-title { font-weight: bold; font-size: 1.2em; margin-bottom: 15px; text-transform: uppercase; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { bg-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
            .paid { background: #dcfce7; color: #166534; }
            .pending { background: #fee2e2; color: #991b1b; }
            .medical-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Clinical Treatment History</h1>
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <strong>Patient Name:</strong> ${user.fullName}<br>
              <strong>Patient ID:</strong> ${user.patientId || 'N/A'}<br>
              <strong>Email:</strong> ${user.email || 'N/A'}
            </div>
            <div style="text-align: right;">
              <strong>Report Generated:</strong> ${new Date().toLocaleDateString()}<br>
              <strong>Clinic:</strong> DentAlign Dental Care
            </div>
          </div>

          <div class="section">
            <div class="section-title">Medical Alerts & Allergies</div>
            <div class="medical-box">
              ${medicalInfo.allergies.length > 0 ? medicalInfo.allergies.join(', ') : 'No known allergies reported.'}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Established Medical Conditions</div>
            <div class="medical-box">
              ${medicalInfo.medicalHistory.length > 0 ? medicalInfo.medicalHistory.join(', ') : 'No chronic conditions reported.'}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Procedure History</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Treatment / Dentist</th>
                  <th>Procedures</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${treatments.map(t => `
                  <tr>
                    <td>${new Date(t.date).toLocaleDateString()}</td>
                    <td>
                      <strong>${t.title}</strong><br>
                      <small>Dr. ${t.dentist?.fullName || 'N/A'}</small>
                    </td>
                    <td>${t.procedures?.join(', ') || 'N/A'}</td>
                    <td><span class="badge ${t.paid ? 'paid' : 'pending'}">${t.paid ? 'PAID' : 'PENDING'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 60px; border-top: 1px solid #eee; pt: 20px; font-size: 0.8em; color: #999; text-align: center;">
            This is a computer-generated medical record from DentAlign Clinical Management System.
          </div>
          
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const getTypeIcon = (title) => {
    if (!title) return '🦷';
    const t = title.toLowerCase();
    if (t.includes('checkup')) return '🔍';
    if (t.includes('consultation')) return '💬';
    if (t.includes('scaling')) return '✨';
    if (t.includes('whitening')) return '⭐';
    if (t.includes('root')) return '🔧';
    if (t.includes('extract')) return '🔨';
    if (t.includes('braces') || t.includes('orthodontic')) return '📐';
    return '🦷';
  };

  if (user.role === 'guest') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <Navbar />
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm text-center max-w-md border border-gray-200 mt-16">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Treatment records are private medical documents. Please sign in to your patient account to view your clinical history.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Sign In to View Records
            </Link>
            <Link to="/" className="w-full bg-gray-50 text-gray-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 lg:pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6 sm:space-y-8 min-w-0">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 min-w-0">
          <div className="space-y-1 text-center md:text-left min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Treatment Records</h1>
            <p className="text-xs text-gray-400 font-medium">History, prescriptions, and health notes repository.</p>
          </div>
          <div className="flex justify-center gap-2 shrink-0">
            <button 
              onClick={handleEditClick} 
              className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              Update Med Info
            </button>
            <button 
              onClick={handleDownload} 
              className="bg-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Export
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar min-w-0 gap-4 mb-2">
          {[
            { id: 'timeline', label: 'History', icon: '🗓️' },
            { id: 'history', label: 'Health', icon: '🧬' },
            { id: 'chart', label: 'Dental Map', icon: '🦷' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 shrink-0 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Views */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {activeTab === 'timeline' && (
            <div className="space-y-10 sm:space-y-12">
              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse"></div>)}
                </div>
              ) : treatments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-gray-100">🦷</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">Your treatment history will appear here after your first visit.</p>
                </div>
              ) : (
                <div className="space-y-10 sm:space-y-12 relative">
                   {/* Timeline line - hidden on very small screens */}
                   <div className="absolute left-[39px] sm:left-[49px] top-0 bottom-0 w-0.5 bg-gray-100 hidden sm:block"></div>
                  
                    {treatments.map((record, idx) => (
                    <div key={record._id} className="relative">
                      <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-all">
                        {/* Status Icon */}
                        <div className="flex-none w-14 h-14 bg-blue-50 text-blue-700 rounded-lg flex flex-col items-center justify-center text-center border border-blue-100 shrink-0">
                          <div className="text-xl">{getTypeIcon(record.title)}</div>
                          <div className="text-[8px] font-bold uppercase">
                            {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        <div className="flex-1 space-y-5 w-full min-w-0">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">{record.title}</div>
                              <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">Dr. {record.dentist?.fullName || 'Specialist'}</h3>
                              <div className="inline-flex px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[8px] font-bold uppercase rounded border border-gray-100">LOG: {record._id?.slice(-8).toUpperCase()}</div>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <div className="text-lg font-bold text-gray-900 mb-1">Rs. {record.cost?.toLocaleString()}</div>
                              <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${record.paid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {record.paid ? 'Settled' : 'Pending'}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                            {/* Procedures */}
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Procedures</h4>
                              <div className="flex flex-wrap gap-2">
                                {record.procedures?.map((p, i) => (
                                  <span key={i} className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium">{p}</span>
                                ))}
                                {(!record.procedures || record.procedures.length === 0) && (
                                  <span className="text-xs text-gray-300 italic">No procedures logged</span>
                                )}
                              </div>
                            </div>

                            {/* Prescriptions */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prescriptions</h4>
                                {record.prescriptions && typeof record.prescriptions === 'string' && record.prescriptions.trim() ? (
                                  <p className="text-xs text-gray-700 bg-blue-50/20 p-4 rounded-xl border border-blue-50 font-medium italic">"{record.prescriptions}"</p>
                                ) : (
                                  <p className="text-xs text-gray-300 italic">No prescriptions</p>
                                )}
                            </div>
                          </div>

                          {record.notes && (
                            <div className="bg-gray-50 p-6 rounded-2xl mt-2 border border-gray-100 italic">
                              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Doctor's Notes</h4>
                              <p className="text-sm text-gray-600">"{record.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl">⚡</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Allergies</h3>
                      <p className="text-xs text-gray-500">Known allergies</p>
                    </div>
                  </div>
                  <button onClick={handleEditClick} className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <div className="space-y-3">
                  {medicalInfo.allergies.length > 0 ? medicalInfo.allergies.map(a => (
                    <div key={a} className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 font-bold text-xs uppercase cursor-default">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      {a}
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic text-center py-4">No allergies reported</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🧬</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Medical History</h3>
                      <p className="text-xs text-gray-500">Past conditions</p>
                    </div>
                  </div>
                  <button onClick={handleEditClick} className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit</button>
                </div>
                <div className="space-y-3">
                  {medicalInfo.medicalHistory.length > 0 ? medicalInfo.medicalHistory.map(m => (
                    <div key={m} className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs uppercase cursor-default">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      {m}
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic text-center py-4">No medical history reported</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-12 pb-6 border-b">Teeth Map (FDI Standard)</div>
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="space-y-6">
                    <div className="text-[10px] font-bold text-gray-500 uppercase">Upper Teeth</div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(tooth => (
                        <div key={tooth} className="w-10 h-14 sm:w-14 sm:h-20 rounded-xl flex flex-col items-center justify-center text-xs font-bold bg-gray-50 border-2 border-transparent text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-default" title={`Tooth ${tooth}`}>
                          {tooth}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="text-[10px] font-bold text-gray-500 uppercase">Lower Teeth</div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(tooth => (
                        <div key={tooth} className="w-10 h-14 sm:w-14 sm:h-20 rounded-xl flex flex-col items-center justify-center text-xs font-bold bg-gray-50 border-2 border-transparent text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-default" title={`Tooth ${tooth}`}>
                          {tooth}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase italic mt-12">Visualization purposes only.</p>
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <header className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Edit Information</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </header>
            <form onSubmit={handleUpdateMedical} className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Allergies</label>
                <textarea 
                  value={editFormData.allergies}
                  onChange={(e) => setEditFormData({ ...editFormData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Latex..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Medical History</label>
                <textarea 
                  value={editFormData.medicalHistory}
                  onChange={(e) => setEditFormData({ ...editFormData, medicalHistory: e.target.value })}
                  placeholder="e.g. Diabetes, Heart issues..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updateLoading}
                  className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTreatmentRecord;
