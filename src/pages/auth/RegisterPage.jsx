import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [activeRole, setActiveRole] = useState('patient');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        slmcNumber: '',
        specialization: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: activeRole,
                slmcNumber: activeRole === 'dentist' ? formData.slmcNumber : undefined,
                specialization: activeRole === 'dentist' ? formData.specialization : undefined
            });

            // Save user data/token
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            // Redirect based on role
            if (response.data.role === 'patient') navigate('/patient/dashboard');
            else if (response.data.role === 'dentist') navigate('/dentist/dashboard');
            else navigate('/');

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const specializations = [
        'General Dentistry', 'Orthodontics', 'Periodontics', 'Prosthodontics', 'Oral Surgery'
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-inter">
            {/* Reduced Height to 500px (-20 amount) and reduced Width to 900px */}
            <div className="bg-white w-full max-w-[900px] h-[500px] rounded-[24px] shadow-2xl flex overflow-hidden">

                {/* Left Column - 40% Width (Slightly narrower/reduced) */}
                <div className="w-[40%] bg-[#007AFF] relative flex flex-col p-5 text-white text-center items-center justify-between">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

                    {/* Branding Section */}
                    <div className="relative z-10 flex flex-col items-center gap-3 mt-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">DentAlign</h1>
                    </div>

                    {/* Image Card - Exact Wireframe Match */}
                    <div className="relative z-10 w-full max-w-[240px] h-[180px] rounded-2xl overflow-hidden border-[3px] border-white/20 shadow-xl group">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=500"
                            alt="Clinic"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-[#007AFF]/20"></div>
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#007AFF] to-transparent"></div>

                        <div className="absolute bottom-3 left-0 right-0 px-2 text-center">
                            <p className="text-white font-bold text-sm drop-shadow-md">
                                State-of-the-art Dental Cares
                            </p>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <div className="relative z-10 mb-2">
                        <p className="text-blue-100 text-[10px] font-bold tracking-[0.2em] uppercase">
                            JOIN 20+ PATIENTS TODAY
                        </p>
                    </div>
                </div>

                {/* Right Column - 60% Width */}
                <div className="w-[60%] flex flex-col justify-center h-full relative">
                    {/* Form Layout */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="max-w-[340px] mx-auto w-full pt-1">
                            <div className="mb-4 text-center">
                                <h2 className="text-2xl font-bold text-[#111827]">Create Account</h2>
                                <p className="text-[#6B7280] text-xs mt-1">
                                    Already a member? <Link to="/login" className="text-[#007AFF] font-bold hover:underline">Log in</Link>
                                </p>
                            </div>

                            <div className="bg-[#F3F4F6] p-1 rounded-lg flex w-full mb-4">
                                <button onClick={() => setActiveRole('patient')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeRole === 'patient' ? 'bg-white text-[#007AFF] shadow-sm' : 'text-[#6B7280]'}`}>Patient</button>
                                <button onClick={() => setActiveRole('dentist')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeRole === 'dentist' ? 'bg-white text-[#007AFF] shadow-sm' : 'text-[#6B7280]'}`}>Dentist</button>
                            </div>

                            <form className="space-y-2.5" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 text-red-600 text-[10px] font-bold p-2 rounded-lg border border-red-100 animate-fadeIn">
                                        {error}
                                    </div>
                                )}
                                <div className="relative group h-10">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#007AFF] transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-xs font-medium text-[#111827]"
                                        placeholder={activeRole === 'dentist' ? "Full Name (Dr.)" : "Full Name"}
                                    />
                                </div>

                                {activeRole === 'dentist' && (
                                    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                                        <input type="text" name="slmcNumber" value={formData.slmcNumber} onChange={handleInputChange} className="w-full h-10 bg-white border border-[#E5E7EB] rounded-xl px-3 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none text-xs font-medium text-[#111827]" placeholder="SLMC No." />
                                        <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full h-10 bg-white border border-[#E5E7EB] rounded-xl px-2 focus:ring-2 focus:ring-[#007AFF] outline-none text-xs font-medium text-[#111827] appearance-none"><option value="">Spec...</option>{specializations.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                    </div>
                                )}

                                <div className="relative group h-10">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#007AFF] transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-xs font-medium text-[#111827]"
                                        placeholder="Email Address"
                                    />
                                </div>

                                <div className="relative group h-10">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-[10px] font-bold text-[#9CA3AF] group-focus-within:text-[#007AFF] border-r border-[#E5E7EB] pr-2 mr-2">+94</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-[3.5rem] pr-4 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-xs font-medium text-[#111827]"
                                        placeholder="7X XXX XXXX"
                                    />
                                </div>

                                <div className="relative group h-10">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#007AFF] transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    </div>
                                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-10 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-xs font-medium text-[#111827]" placeholder="Password" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#007AFF] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-[#007AFF]/20 active:scale-[0.98] transition-all text-sm mt-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Registering...' : 'Register Account'}
                                </button>
                            </form>

                            <p className="text-[10px] text-center text-[#9CA3AF] mt-3">
                                By registering, you agree to our <a href="#" className="underline hover:text-[#007AFF]">Terms</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
