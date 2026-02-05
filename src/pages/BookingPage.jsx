import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BookingPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const [step, setStep] = useState(1);
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [selectedService, setSelectedService] = useState('Dental Checkup');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('');
    const [patientNote, setPatientNote] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const services = [
        { name: 'Dental Checkup', price: 2500, duration: '30 mins', icon: '🔍' },
        { name: 'Teeth Whitening', price: 15000, duration: '60 mins', icon: '✨' },
        { name: 'Root Canal', price: 35000, duration: '90 mins', icon: '🦷' },
        { name: 'Cavity Filling', price: 8000, duration: '45 mins', icon: '💎' },
        { name: 'Dental Extraction', price: 12000, duration: '45 mins', icon: '🚫' },
    ];

    const currentService = services.find(s => s.name === selectedService);
    const timeSlots = ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '01:00 PM', '02:30 PM', '03:15 PM', '04:00 PM'];

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/users/dentists');
                setDentists(data);
                if (data.length > 0) setSelectedDentist(data[0]);
            } catch (error) {
                console.error('Error fetching dentists:', error);
            }
        };
        fetchDentists();
    }, []);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!selectedDentist || !selectedDate) return;
            setSlotsLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/appointments/booked-slots?dentistId=${selectedDentist._id}&date=${selectedDate}`, config);
                setBookedSlots(data);
                if (data.includes(selectedTime)) setSelectedTime('');
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            } finally {
                setSlotsLoading(false);
            }
        };
        fetchBookedSlots();
    }, [selectedDentist, selectedDate, user.token]);

    const handleConfirmBooking = async () => {
        if (!user) return navigate('/login');
        if (!selectedTime) return alert('Please select a time slot.');

        setBookingLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const appointmentData = {
                dentistId: selectedDentist._id,
                date: selectedDate,
                time: selectedTime,
                reason: selectedService,
                serviceName: selectedService,
                estimatedCost: currentService?.price || 0,
                note: patientNote
            };
            await axios.post('http://localhost:5000/api/appointments', appointmentData, config);
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed.');
        } finally {
            setBookingLoading(false);
        }
    };

    const isSlotBooked = (time) => bookedSlots.includes(time);

    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-inter">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-white max-w-xl w-full rounded-[48px] p-16 text-center shadow-2xl border border-gray-100 flex flex-col items-center">
                        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mb-8 shadow-xl shadow-green-100 animate-bounce">✓</div>
                        <h2 className="text-4xl font-black text-[#111827] mb-4 tracking-tighter">Visit Confirmed!</h2>
                        <p className="text-gray-400 font-bold mb-10 leading-relaxed">Your visit for <span className="text-[#111827]">{selectedService}</span> with <span className="text-[#111827]">Dr. {selectedDentist?.fullName}</span> is scheduled.</p>
                        <button onClick={() => navigate('/patient/dashboard')} className="w-full bg-[#111827] text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl">Go to Dashboard</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-inter pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto w-full px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-12">
                        {step === 1 ? (
                            <>
                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">Select Service</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {services.map(s => (
                                            <div key={s.name} onClick={() => setSelectedService(s.name)} className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex items-center gap-6 ${selectedService === s.name ? 'border-[#007AFF] bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'}`}>
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${selectedService === s.name ? 'bg-[#007AFF] text-white' : 'bg-gray-50 text-gray-600'}`}>{s.icon}</div>
                                                <div className="flex-1 font-bold text-[#111827]">{s.name}</div>
                                                <div className={`text-sm font-black ${selectedService === s.name ? 'text-[#007AFF]' : 'text-gray-400'}`}>Rs. {s.price.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">Pick Date & Time</h2>
                                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                                        <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSelectedDate(e.target.value)} className="w-full max-w-sm bg-gray-50 p-4 rounded-2xl font-bold text-[#111827] border-none outline-none focus:bg-blue-50 transition-colors" />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Available Sessions</h4>
                                                {slotsLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {timeSlots.map(t => {
                                                    const booked = isSlotBooked(t);
                                                    return (
                                                        <button
                                                            key={t}
                                                            disabled={booked}
                                                            onClick={() => setSelectedTime(t)}
                                                            className={`py-4 rounded-2xl text-xs font-bold border transition-all relative overflow-hidden ${booked ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed' : selectedTime === t ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'}`}
                                                        >
                                                            {t}
                                                            {booked && <span className="absolute inset-0 flex items-center justify-center bg-red-50/10 text-[8px] font-black uppercase tracking-tighter text-red-400/50 mt-6 pt-1">Reserved</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <section className="space-y-12 animate-fade-in">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">Visit Details</h2>
                                    <textarea value={patientNote} onChange={(e) => setPatientNote(e.target.value)} placeholder="Symptoms or concerns..." className="w-full h-40 bg-white border border-gray-100 rounded-[32px] p-8 font-medium text-[#111827] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none shadow-sm"></textarea>
                                </div>
                                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                                    <h2 className="text-xl font-black text-[#111827]">Financial Disclosure</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-4 border-b border-gray-50 text-sm font-bold">
                                            <span className="text-gray-400">{selectedService}</span>
                                            <span className="text-[#111827]">Rs. {currentService?.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-gray-50 text-sm font-bold bg-blue-50/30 -mx-4 px-4 rounded-xl">
                                            <span className="text-[#007AFF]">Required Booking Fee</span>
                                            <span className="text-[#007AFF]">Rs. 500</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-6">
                                            <span className="text-lg font-black text-[#111827]">Total Commitment</span>
                                            <span className="text-3xl font-black text-[#007AFF]">Rs. {(currentService?.price + 500).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-50">
                            <h3 className="text-xl font-black text-[#111827] mb-8">Booking Summary</h3>
                            <div className="space-y-6 mb-10">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Service</div>
                                    <div className="text-sm font-black text-[#111827]">{selectedService}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Schedule</div>
                                    <div className="text-sm font-black text-[#111827]">{new Date(selectedDate).toLocaleDateString()} • {selectedTime || 'Pending'}</div>
                                </div>
                            </div>
                            {step === 1 ? (
                                <button onClick={() => selectedTime ? setStep(2) : alert('Select a time')} className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">Continue</button>
                            ) : (
                                <div className="space-y-4">
                                    <button onClick={handleConfirmBooking} disabled={bookingLoading} className="w-full bg-[#007AFF] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0066D6] transition-all shadow-xl shadow-blue-100">{bookingLoading ? 'Processing...' : 'Place Order'}</button>
                                    <button onClick={() => setStep(1)} className="w-full text-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#111827]">Back</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
