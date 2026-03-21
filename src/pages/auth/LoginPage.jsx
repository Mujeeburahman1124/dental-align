import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { idToken });
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            setSuccess('Login successful');
            setTimeout(() => {
                if (response.data.role === 'patient') navigate('/patient/dashboard');
                else navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { 
                password: formData.password,
                role: formData.role.toLowerCase() 
            };
            if (formData.email.includes('@')) payload.email = formData.email;
            else payload.patientId = formData.email;

            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, payload);
            const sanitized = { ...response.data, token: response.data.token?.trim() };
            localStorage.setItem('userInfo', JSON.stringify(sanitized));
            setSuccess('Login successful');
            setTimeout(() => {
                const role = sanitized.role;
                if (role === 'patient') navigate('/patient/dashboard');
                else if (role === 'dentist') navigate('/dentist/dashboard');
                else if (role === 'staff') navigate('/staff/dashboard');
                else if (role === 'admin') navigate('/admin/dashboard');
                else navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email, password, or role.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side - Blue Branding */}
                <div className="w-full md:w-5/12 bg-blue-600 p-6 sm:p-8 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
                            <span className="text-xl">🦷</span>
                            <span className="font-bold tracking-tight uppercase text-xs">DentAlign Clinic</span>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-xl lg:text-2xl font-bold leading-tight">
                                Welcome Back
                            </h1>
                            <p className="text-xs text-blue-100 leading-relaxed">
                                Access your patient portal to manage appointments, view records, and connect with your dentist.
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative Image Container */}
                    <div className="mt-8 relative z-10 w-full h-40 rounded-lg overflow-hidden border border-blue-400/30 shadow-inner">
                        <img 
                            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" 
                            alt="Modern Dental Clinic" 
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply pointer-events-none"></div>
                    </div>
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-800/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-6 sm:p-8 bg-white flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        {/* Mobile Logo (Visible only on small screens) */}
                        <div className="md:hidden pb-6 mb-6 border-b border-gray-100">
                             <Link to="/" className="inline-flex items-center gap-2">
                                <span className="text-xl">🦷</span>
                                <span className="font-bold tracking-tight uppercase text-sm text-blue-600">DentAlign Clinic</span>
                            </Link>
                        </div>

                        <header className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Please select your role and enter credentials.</p>
                        </header>

                        {/* Role Switcher */}
                        <div className="bg-gray-50 p-1.5 rounded-2xl flex gap-1 mb-6 border border-gray-100 shadow-inner">
                            {['Patient', 'Dentist', 'Staff', 'Admin'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.role === r ? 'bg-white text-blue-600 shadow-lg shadow-blue-100/50 scale-100' : 'text-gray-400 hover:text-gray-900 scale-95 opcaity-60'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs font-medium">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs font-medium">
                                    {success}
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">
                                    {formData.role === 'Patient' ? 'Email / Patient ID' : 'Email Address'}
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoFocus
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">Password</label>
                                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">Forgot Password?</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                        {showPassword ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-1.5 mt-1 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Processing...' : 'Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="w-full py-1.5 bg-white text-gray-700 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
                            >
                                Continue as Guest
                            </button>
                        </form>

                        <div className="mt-5 pt-4 border-t border-gray-100">
                            <p className="text-[11px] text-center text-gray-600 mb-2.5">
                                Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1">Register Now</Link>
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-xs text-gray-700">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" className="w-3.5 h-3.5" alt="Google" />
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-xs text-gray-700">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.04 2.15-3.53 2.15-1.46 0-1.87-.88-3.66-.88-1.79 0-2.3.85-3.61.88-1.45.03-2.48-1.37-3.41-2.72-1.91-2.76-3.37-7.8-1.39-11.23 1-1.7 2.73-2.77 4.61-2.8 1.44-.03 2.8.97 3.68.97.87 0 2.52-1.19 4.22-1.01 1.7.07 3.25.68 4.41 2.05-3.48 2.37-2.91 7.42.06 8.78-.71 1.77-1.63 3.51-3.48 5.41zM11.97 4.02c-.78-.94-1.3-2.25-1.15-3.55 1.12.05 2.48.75 3.29 1.69.72.83 1.36 2.17 1.21 3.43-1.25.1-2.57-.63-3.35-1.57z" /></svg>
                                    Apple
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
