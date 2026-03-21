import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BookingPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo')) || null;

    const [formData, setFormData] = useState({
        patientName: user?.fullName || '',
        patientAge: user?.age || '',
        patientPhone: user?.phone || '',
        patientEmail: user?.email || '',
        date: '',
        time: '',
        service: '',
        dentist: '',
        branch: '',
        notes: '',
        preferredPayment: 'Cash'
    });

    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [dentists, setDentists] = useState([]);
    const [timeSlots, setTimeSlots] = useState([
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ]);

    const services = [
        'General Checkup', 'Teeth Cleaning', 'Teeth Whitening', 'Cavity Filling',
        'Root Canal', 'Tooth Extraction', 'Dental Implant', 'Orthodontics', 'Emergency Care'
    ];

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [settingsRes, branchRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/settings`),
                    axios.get(`${API_BASE_URL}/api/branches`)
                ]);
                if (settingsRes.data.timeSlots?.length > 0) setTimeSlots(settingsRes.data.timeSlots);
                setBranches(branchRes.data);
                if (branchRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, branch: branchRes.data[0]._id }));
                }
            } catch (err) { console.error('Fetch error:', err); }
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                if (formData.branch) {
                    const { data } = await axios.get(`${API_BASE_URL}/api/schedules/available-dentists`, {
                        params: { branchId: formData.branch, date: formData.date }
                    });
                    setDentists(data);
                } else {
                    const { data } = await axios.get(`${API_BASE_URL}/api/users/dentists`);
                    setDentists(data);
                }
            } catch (err) { console.error('Dentist fetch error:', err); }
        };
        fetchDentists();
    }, [formData.branch, formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time || !formData.service || (!user && !formData.patientName)) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            let selectedDentistId = formData.dentist;
            if (!selectedDentistId && dentists.length > 0) {
                selectedDentistId = dentists[Math.floor(Math.random() * dentists.length)]._id;
            }

            if (!selectedDentistId) {
                alert('No dentists available. Please try another date or branch.');
                setLoading(false);
                return;
            }

            if (user && user.role === 'patient') {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`${API_BASE_URL}/api/appointments`, {
                    date: formData.date,
                    time: formData.time,
                    reason: formData.service,
                    dentistId: selectedDentistId,
                    branchId: formData.branch,
                    notes: formData.notes,
                    patientAge: formData.patientAge,
                    paymentPreference: formData.preferredPayment
                }, config);
                alert('Appointment booked successfully! 🎉 Email confirmation sent.');
                navigate('/patient/dashboard');
            } else {
                const response = await axios.post(`${API_BASE_URL}/api/appointments/public`, {
                    patientName: formData.patientName,
                    patientAge: formData.patientAge,
                    patientPhone: formData.patientPhone,
                    patientEmail: formData.patientEmail,
                    date: formData.date,
                    time: formData.time,
                    reason: formData.service,
                    dentist: selectedDentistId,
                    branchId: formData.branch,
                    notes: formData.notes,
                    paymentPreference: formData.preferredPayment
                });

                const pId = response.data.appointment?.patient?.patientId || "Generated";
                alert(`Appointment Request Sent!\n\nYour Patient ID is: ${pId}\n\nPlease save this ID for your records.`);
                navigate('/login');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12 text-gray-900">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <header className="mb-8 px-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 text-[10px] font-bold uppercase tracking-wider mb-2">
                        Online Booking
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Schedule Your Visit</h1>
                    <p className="text-xs text-gray-500 mt-1.5 max-w-lg">Secure your slot with our specialist dentists in just a few clicks.</p>
                </header>

                <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Patient Information - Only shown for guests/unlogged */}
                        {(!user || user.role === 'guest') && (
                            <section>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Patient Details</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Full Name</label>
                                        <input
                                            name="patientName" value={formData.patientName} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="John Doe" required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Age</label>
                                        <input
                                            type="number" name="patientAge" value={formData.patientAge} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="e.g. 25" required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Phone Number</label>
                                        <input
                                            name="patientPhone" value={formData.patientPhone} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="07X XXX XXXX" required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Email Address</label>
                                        <input
                                            name="patientEmail" value={formData.patientEmail} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                            placeholder="name@example.com" required
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Appointment Configuration */}
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-1.5 h-4 bg-emerald-600 rounded-full"></div>
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Appointment Setup</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Branch Selection</label>
                                    <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold">
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Clinical Service</label>
                                    <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold" required>
                                        <option value="">Select Service</option>
                                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Preferred Doctor</label>
                                    <select name="dentist" value={formData.dentist} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold">
                                        <option value="">Any Available Specialist</option>
                                        {dentists.map(d => <option key={d._id} value={d._id}>Dr. {d.fullName}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Requested Date</label>
                                    <input type="date" min={today} name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold" required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight ml-1">Preferred Time</label>
                                    <select name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold" required>
                                        <option value="">Pick a Slot</option>
                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-1.5 h-4 bg-gray-900 rounded-full"></div>
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Payment Preference</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {[
                                    { id: 'Card Payment', icon: '💳' },
                                    { id: 'Online Payment', icon: '📱' },
                                    { id: 'Direct Payment', icon: '🏦' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, preferredPayment: opt.id }))}
                                        className={`p-3.5 rounded-xl border flex items-center justify-center gap-3 transition-all ${formData.preferredPayment === opt.id ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        <span className="text-lg">{opt.icon}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{opt.id}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
                            >
                                {loading ? 'Wait...' : 'Book Now'}
                            </button>
                            <p className="mt-4 text-[10px] text-gray-400 text-center font-medium">
                                * Cancellations must be made 24 hours in advance.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default BookingPage;
