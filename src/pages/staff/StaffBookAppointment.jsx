import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import Navbar from '../../components/Navbar';

const StaffBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem('userInfo')) || { fullName: 'Staff' };
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        date: '',
        time: '',
        service: '',
        dentist: '',
        notes: '',
        sendEmail: true
    });

    const [loading, setLoading] = useState(false);
    const [dentists, setDentists] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    // Fetch dentists on load
    React.useEffect(() => {
        const fetchDentists = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/users/dentists`);
                setDentists(data);
            } catch (error) {
                console.error('Error fetching dentists:', error);
            }
        };
        fetchDentists();
    }, []);

    // Check availability when date or dentist changes
    React.useEffect(() => {
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

        // Only run if dentist ID is selected (not empty)
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
    ]); // Default fallback

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

            // Create appointment for walk-in patient
            const { data } = await axios.post(`${API_BASE_URL}/api/appointments/walk-in`, {
                patientName: formData.patientName,
                patientEmail: formData.patientEmail || undefined,
                patientPhone: formData.patientPhone,
                date: formData.date,
                time: formData.time,
                reason: formData.service,
                dentist: formData.dentist, // Now sending dentist ID
                notes: formData.notes,
                status: 'confirmed', // Staff bookings are auto-confirmed
                sendEmail: formData.sendEmail
            }, config);

            const pId = data.appointment?.patient?.patientId || "Generated";
            alert(`Appointment booked successfully for ${formData.patientName}! 🎉\n\nPatient ID: ${pId}\n\nPlease share this ID with the patient.`);

            // Reset form
            setFormData({
                patientName: '',
                patientEmail: '',
                patientPhone: '',
                date: '',
                time: '',
                service: '',
                dentist: '',
                notes: '',
                sendEmail: true
            });
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 font-inter">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Book Appointment for Patient</h1>
                    <p className="text-sm text-gray-600">Fill in patient details to schedule an appointment</p>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-4 md:p-6 space-y-5">

                    {/* Patient Information */}
                    <div className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-black">1</span>
                            Patient Information
                        </h2>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                            <label className="block text-[10px] font-bold text-blue-800 uppercase mb-1">New Patient ID</label>
                            <div className="text-sm font-bold text-blue-900">Auto-generated upon booking</div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Patient's full name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email (Optional)</label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                                    placeholder="patient@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number *</label>
                            <input
                                type="tel"
                                name="patientPhone"
                                value={formData.patientPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                                placeholder="0771234567"
                            />
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-black">2</span>
                            Appointment Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Dentist (Required for availability check)</label>
                                <select
                                    name="dentist"
                                    value={formData.dentist}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="">Select Dentist</option>
                                    {dentists.map(dentist => (
                                        <option key={dentist._id} value={dentist._id}>Dr. {dentist.fullName} ({dentist.specialization || 'General'})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Time *</label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map(slot => {
                                    const isBooked = bookedSlots.includes(slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => !isBooked && setFormData({ ...formData, time: slot })}
                                            disabled={isBooked || (!formData.dentist || !formData.date)}
                                            className={`px-2 py-2 text-xs font-bold rounded-lg border transition-all ${formData.time === slot
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : isBooked
                                                    ? 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                }`}
                                        >
                                            {slot}
                                            {isBooked && <span className="block text-[10px] text-red-400 font-normal">Booked</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            {(!formData.dentist || !formData.date) && <p className="text-xs text-orange-500 mt-1">Please select a dentist and date to see availability.</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Service *</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">Select service</option>
                                {services.map(service => (
                                    <option key={service} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                                placeholder="Any special requirements or concerns..."
                            ></textarea>
                        </div>

                        {/* SMS Notification Option */}
                        <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="sendEmail"
                                name="sendEmail"
                                checked={formData.sendEmail}
                                onChange={handleChange}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="sendEmail" className="text-xs font-bold text-gray-700">
                                Send confirmation SMS to patient
                            </label>
                        </div>
                    </div>

                    {/* Summary */}
                    {formData.date && formData.time && formData.service && formData.patientName && (
                        <div className="bg-indigo-50 rounded-xl p-4 space-y-2">
                            <h3 className="font-bold text-sm text-gray-900">Booking Summary</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-600">Patient:</span>
                                    <div className="font-bold text-gray-900">{formData.patientName}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Service:</span>
                                    <div className="font-bold text-gray-900">{formData.service}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Date:</span>
                                    <div className="font-bold text-gray-900">{new Date(formData.date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Time:</span>
                                    <div className="font-bold text-gray-900">{formData.time}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/staff/dashboard')}
                            className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-sm bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Appointment will be auto-confirmed. {formData.sendEmail && 'Patient will receive SMS notification.'}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default StaffBookAppointment;
