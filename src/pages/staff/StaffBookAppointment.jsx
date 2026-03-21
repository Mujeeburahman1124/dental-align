import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const StaffBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();
    const location = useLocation();
    const prefilled = location.state || {};

    const [formData, setFormData] = useState({
        patientName: prefilled.fullName || '',
        patientEmail: prefilled.email || '',
        patientPhone: prefilled.phone || '',
        patientAge: prefilled.age || '',
        date: '',
        time: '',
        service: '',
        dentist: '',
        notes: '',
        sendEmail: true
    });

    const [patientId, setPatientId] = useState(prefilled.patientId || '');
    const [loading, setLoading] = useState(false);
    const [dentists, setDentists] = useState([]);
    const [patients, setPatients] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    // Fetch patients and dentists on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const [dentistsRes, patientsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/users/dentists`),
                    axios.get(`${API_BASE_URL}/api/users/patients`, config)
                ]);
                setDentists(dentistsRes.data);
                setPatients(patientsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [user.token]);

    // Handle patient selection change
    const handlePatientChange = (e) => {
        const id = e.target.value;
        setPatientId(id);
        
        if (id) {
            const selected = patients.find(p => p._id === id);
            if (selected) {
                setFormData(prev => ({
                    ...prev,
                    patientName: selected.fullName || '',
                    patientEmail: selected.email || '',
                    patientPhone: selected.phone || '',
                    patientAge: selected.age || ''
                }));
            }
        } else {
            // Walk-in mode reset
            setFormData(prev => ({
                ...prev,
                patientName: '',
                patientEmail: '',
                patientPhone: '',
                patientAge: ''
            }));
        }
    };

    // Check availability when date or dentist changes
    useEffect(() => {
        const fetchAvailability = async () => {
            if (formData.date && formData.dentist) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`${API_BASE_URL}/api/appointments/booked-slots?dentistId=${formData.dentist}&date=${formData.date}`, config);
                    setBookedSlots(data);
                } catch (error) {
                    console.error('Error checking availability:', error);
                }
            } else {
                setBookedSlots([]);
            }
        };

        if (formData.dentist) {
            fetchAvailability();
        }
    }, [formData.date, formData.dentist, user.token]);

    const services = [
        'General Checkup', 'Teeth Cleaning', 'Teeth Whitening', 'Cavity Filling',
        'Root Canal', 'Tooth Extraction', 'Dental Implant', 'Orthodontics',
        'Emergency Care', 'Consultation'
    ];

    const [timeSlots, setTimeSlots] = useState([
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ]);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/settings`);
                if (data.timeSlots && data.timeSlots.length > 0) {
                    setTimeSlots(data.timeSlots);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.patientName || !formData.patientPhone ||
            !formData.date || !formData.time || !formData.service || !formData.dentist) {
            alert('Please fill in required fields (Name, Phone, Date, Time, Service, Dentist).');
            return;
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const endpoint = patientId ? `${API_BASE_URL}/api/appointments/staff` : `${API_BASE_URL}/api/appointments/walk-in`;
            const payload = patientId ? {
                patientId,
                date: formData.date,
                time: formData.time,
                reason: formData.service,
                dentistId: formData.dentist,
                notes: formData.notes,
                patientAge: formData.patientAge
            } : {
                patientName: formData.patientName,
                patientEmail: formData.patientEmail || undefined,
                patientPhone: formData.patientPhone,
                patientAge: formData.patientAge,
                date: formData.date,
                time: formData.time,
                reason: formData.service,
                dentist: formData.dentist,
                notes: formData.notes,
                status: 'confirmed',
                sendEmail: formData.sendEmail
            };

            const { data } = await axios.post(endpoint, payload, config);

            const pId = data.appointment?.patient?.patientId || data.appointment?.patientId || "Success";
            alert(`Appointment booked successfully for ${formData.patientName}! 🎉\n\nPatient ID: ${pId}`);

            navigate('/staff/dashboard');

        } catch (error) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-12">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <header className="mb-8 sm:mb-12 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-xs font-semibold mb-4 md:mb-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Staff Portal
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Book Appointment</h1>
                    <p className="text-sm sm:text-base text-gray-500 max-w-xl">Register walk-in patients or manually schedule appointments for existing clients.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Patient Information */}
                    <section className="bg-white p-6 sm:p-10 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Patient Details</h2>
                                <p className="text-sm text-gray-500 font-medium">Basic contact information</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Select Registered Patient</label>
                                <select
                                    value={patientId}
                                    onChange={handlePatientChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
                                >
                                    <option value="">-- Manual Walk-in / New Profile --</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.fullName} ({p.patientId || 'New'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    readOnly={!!patientId}
                                    required
                                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${patientId ? 'bg-gray-50 text-gray-500' : 'bg-white border-gray-300'}`}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Patient Age</label>
                                <input
                                    type="number"
                                    name="patientAge"
                                    value={formData.patientAge}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm bg-white"
                                    placeholder="Years"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    readOnly={!!patientId}
                                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${patientId ? 'bg-gray-50 text-gray-500' : 'bg-white border-gray-300'}`}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    value={formData.patientPhone}
                                    onChange={handleChange}
                                    readOnly={!!patientId}
                                    required
                                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${patientId ? 'bg-gray-50 text-gray-500' : 'bg-white border-gray-300'}`}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Appointment Details */}
                    <section className="bg-white p-6 sm:p-10 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Appointment Setup</h2>
                                <p className="text-sm text-gray-500 font-medium">Schedule date, time, and service</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Dentist <span className="text-red-500">*</span></label>
                                <select
                                    name="dentist"
                                    value={formData.dentist}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-700 bg-white"
                                >
                                    <option value="">Select Dentist</option>
                                    {dentists.map(dentist => (
                                        <option key={dentist._id} value={dentist._id}>Dr. {dentist.fullName} ({dentist.specialization || 'General'})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between items-end">
                                <label className="block text-sm font-semibold text-gray-700">Available Times <span className="text-red-500">*</span></label>
                                {(!formData.dentist || !formData.date) && <span className="text-xs font-semibold text-orange-500">Please select Date & Dentist</span>}
                            </div>
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                                {timeSlots.map(slot => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isSelected = formData.time === slot;
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => !isBooked && setFormData({ ...formData, time: slot })}
                                            disabled={isBooked || (!formData.dentist || !formData.date)}
                                            className={`px-3 py-3 rounded-lg text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1 ${isSelected
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : isBooked
                                                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                                                }`}
                                        >
                                            {slot}
                                            {isBooked && <span className="text-[10px] font-semibold uppercase">Booked</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Service Required <span className="text-red-500">*</span></label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-700 bg-white"
                                >
                                    <option value="">Select Service</option>
                                    {services.map(service => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                                    placeholder="Any special requests or conditions..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Notifications Toggle */}
                        <div className="mt-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="sendEmail"
                                        checked={formData.sendEmail}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.sendEmail ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.sendEmail ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Send Confirmation</div>
                                    <div className="text-xs text-gray-500">Notify patient via Email/SMS</div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Summary & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/staff/dashboard')}
                            className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default StaffBookAppointment;
