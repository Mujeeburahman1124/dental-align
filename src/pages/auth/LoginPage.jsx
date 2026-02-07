import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Patient',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
            const payload = {
                password: formData.password
            };

            if (formData.email.includes('@')) {
                payload.email = formData.email;
            } else {
                payload.patientId = formData.email;
            }

            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, payload);

            // Save user data/token
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            setSuccess('Login Successful! Redirecting...');

            setTimeout(() => {
                // Redirect based on role
                if (response.data.role === 'patient') navigate('/patient/dashboard');
                else if (response.data.role === 'dentist') navigate('/dentist/dashboard');
                else if (response.data.role === 'staff') navigate('/staff/dashboard');
                else if (response.data.role === 'admin') navigate('/admin/dashboard');
                else navigate('/');
            }, 1500);

        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.message || err.message || 'Connection failed. Is the server running?');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-inter">
            {/* Height Reduced to 500px to match Register Page */}
            <div className="bg-white w-full max-w-[900px] h-[500px] rounded-[24px] shadow-2xl flex overflow-hidden">

                {/* Left Column - Branding */}
                <div className="w-[45%] bg-[#007AFF] relative flex flex-col p-6 text-white">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

                    {/* Logo - Compact */}
                    <div className="relative z-10 flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight">DentAlign</span>
                    </div>

                    {/* Headlines */}
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold leading-tight mb-2">
                            Manage your smile <br /> with ease
                        </h1>
                        <p className="text-blue-100/80 text-xs leading-relaxed max-w-xs">
                            Access DentAlign's secure portal for real-time dental management.
                        </p>
                    </div>

                    {/* NEW: Small Picture in the Gap */}
                    <div className="relative z-10 flex-1 flex items-center justify-center py-2">
                        <div className="w-[140px] h-[100px] bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=300"
                                alt="Dental Checkup"
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                            />
                            {/* Mini Floating Badge */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full border border-white shadow-sm"></div>
                        </div>
                    </div>

                    {/* Glass Cards Section - Compact Bottom */}
                    <div className="relative z-10 mt-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                        {/* HIPAA Card */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-xs">HIPAA Compliant</h3>
                                <p className="text-[9px] text-blue-100/70">Your medical data is fully encrypted</p>
                            </div>
                        </div>

                        {/* Grid Mini Cards */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/10 rounded-lg p-2 border border-white/10 text-center">
                                <div className="text-[8px] font-bold uppercase tracking-wider text-blue-200/60 mb-0.5">Bookings</div>
                                <div className="text-xs font-bold">24/7 Access</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 border border-white/10 text-center">
                                <div className="text-[8px] font-bold uppercase tracking-wider text-blue-200/60 mb-0.5">History</div>
                                <div className="text-xs font-bold">Full Records</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="w-[55%] p-8 flex flex-col justify-center">
                    <div className="max-w-[340px] mx-auto w-full">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-[#111827] mb-1">Welcome back</h2>
                            <p className="text-[#6B7280] text-xs">Please enter your details to sign in.</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-[#F3F4F6] p-1 rounded-lg mb-4">
                            <button
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all bg-white text-[#111827] shadow-sm`}
                            >
                                Sign In
                            </button>
                            <Link
                                to="/register"
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all text-[#6B7280] hover:bg-gray-200 text-center flex items-center justify-center`}
                            >
                                Create Account
                            </Link>
                        </div>

                        {/* Functional Role Selector */}
                        <div className="mb-4 relative">
                            <button
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                className="text-xs font-bold text-[#111827] flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                I AM A <span className="text-[#007AFF]">{formData.role}</span>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}>
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showRoleDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">
                                    {['Patient', 'Dentist', 'Staff', 'Admin'].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, role }));
                                                setShowRoleDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-blue-50 hover:text-[#007AFF] transition-colors ${formData.role === role ? 'text-[#007AFF] bg-blue-50' : 'text-gray-600'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form className="space-y-3" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 text-red-600 text-[10px] font-bold p-2 rounded-lg border border-red-100 animate-fadeIn">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 text-green-600 text-[10px] font-bold p-2 rounded-lg border border-green-100 animate-fadeIn mb-2 flex items-center gap-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                                    {success}
                                </div>
                            )}
                            <div className="relative group h-10">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#007AFF] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-sm text-[#111827]"
                                    placeholder={formData.role === 'Patient' ? "Patient ID (e.g. P-1001) or Email" : "Email Address"}
                                />
                            </div>

                            <div className="relative group h-10">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#007AFF] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-10 focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]/60 text-sm text-[#111827]"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#007AFF] transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                </button>
                            </div>

                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center">
                                    <input id="remember" type="checkbox" className="w-3.5 h-3.5 text-[#007AFF] rounded focus:ring-[#007AFF]" />
                                    <label htmlFor="remember" className="ml-2 text-[10px] text-[#6B7280]">Remember me</label>
                                </div>
                                <a href="#" className="text-[10px] font-bold text-[#007AFF]">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-[#007AFF]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <div className="relative mb-3">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
                                <span className="relative px-2 text-[10px] font-bold text-[#9CA3AF] bg-white uppercase tracking-widest">Or continue with</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 border border-[#E5E7EB] rounded-xl flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-all text-xs font-bold text-[#111827]"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg></button>
                                <button className="flex-1 py-2 border border-[#E5E7EB] rounded-xl flex items-center justify-center gap-2 hover:bg-[#FAFAFA] transition-all text-xs font-bold text-[#111827]"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.04 2.15-3.53 2.15-1.46 0-1.87-.88-3.66-.88-1.79 0-2.3.85-3.61.88-1.45.03-2.48-1.37-3.41-2.72-1.91-2.76-3.37-7.8-1.39-11.23 1-1.7 2.73-2.77 4.61-2.8 1.44-.03 2.8.97 3.68.97.87 0 2.52-1.19 4.22-1.01 1.7.07 3.25.68 4.41 2.05-3.48 2.37-2.91 7.42.06 8.78-.71 1.77-1.63 3.51-3.48 5.41zM11.97 4.02c-.78-.94-1.3-2.25-1.15-3.55 1.12.05 2.48.75 3.29 1.69.72.83 1.36 2.17 1.21 3.43-1.25.1-2.57-.63-3.35-1.57z" /></svg></button>
                            </div>

                            <p className="mt-3 text-[10px] text-[#9CA3AF] font-bold">
                                Don't have an account? <Link to="/register" className="text-[#007AFF] hover:underline">Register now</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
