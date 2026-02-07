import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BookingPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo')) || null;

    const [formData, setFormData] = useState({
        patientName: user?.fullName || '',
        patientEmail: user?.email || '',
        patientPhone: user?.phone || '',
        date: '',
        time: '',
        service: '',
        dentist: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);

    const services = [
        'General Checkup', 'Teeth Cleaning', 'Teeth Whitening', 'Cavity Filling',
        'Root Canal', 'Tooth Extraction', 'Dental Implant', 'Orthodontics', 'Emergency Care'
    ];

    const dentists = [
        { id: '1', name: 'Dr. Sarah Johnson' },
        { id: '2', name: 'Dr. Muksith Ahmed' },
        { id: '3', name: 'Dr. Emily Chen' }
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Please login to book an appointment');
            navigate('/login');
            return;
        }

        if (!formData.date || !formData.time || !formData.service) {
            alert('Please fill in all required fields');
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

            await axios.post(`${API_BASE_URL}/api/appointments`, {
                date: formData.date,
                time: formData.time,
                reason: formData.service,
                dentist: formData.dentist || null,
                notes: formData.notes,
                status: 'pending'
            }, config);

            alert('Appointment booked successfully! 🎉');
            navigate('/patient/dashboard');
        } catch (error) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 font-inter">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
                {/* Header - Compact */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Book Appointment</h1>
                    <p className="text-sm text-gray-600">Fill in the details to schedule your visit</p>
                </div>

                {/* Booking Form - Compact */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-4 md:p-6 space-y-5">

                    {/* Patient Information */}
                    <div className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">1</span>
                            Patient Info
                        </h2>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email *</label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone *</label>
                            <input
                                type="tel"
                                name="patientPhone"
                                value={formData.patientPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                placeholder="0771234567"
                            />
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">2</span>
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
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Time *</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Choose time</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Service *</label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Select service</option>
                                {services.map(service => (
                                    <option key={service} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Dentist (Optional)</label>
                            <select
                                name="dentist"
                                value={formData.dentist}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Any available</option>
                                {dentists.map(dentist => (
                                    <option key={dentist.id} value={dentist.name}>{dentist.name}</option>
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
                                className="w-full px-3 py-2.5 text-sm rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                                placeholder="Any concerns..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Summary - Compact */}
                    {formData.date && formData.time && formData.service && (
                        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                            <h3 className="font-bold text-sm text-gray-900">Summary</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-600">Date:</span>
                                    <div className="font-bold text-gray-900">{new Date(formData.date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Time:</span>
                                    <div className="font-bold text-gray-900">{formData.time}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Service:</span>
                                    <div className="font-bold text-gray-900">{formData.service}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Fee:</span>
                                    <div className="font-bold text-blue-600">Rs. 500</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons - Compact */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-4 py-3 text-sm bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-sm bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
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
                        Booking fee: Rs. 500. Payment after confirmation.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
