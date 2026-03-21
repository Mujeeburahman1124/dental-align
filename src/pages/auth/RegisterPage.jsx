import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                fullName: formData.fullName,
                email: formData.email || undefined,
                phone: formData.phone,
                password: formData.password,
                role: activeRole,
                slmcNumber: activeRole === 'dentist' ? formData.slmcNumber : undefined,
                specialization: activeRole === 'dentist' ? formData.specialization : undefined
            });

            localStorage.setItem('userInfo', JSON.stringify(response.data));

            if (response.data.role === 'patient' && response.data.patientId) {
                alert(`Registration Successful!\n\nYour Patient ID is: ${response.data.patientId}\n\nPlease save this ID for your records.`);
            }

            setTimeout(() => {
                if (response.data.role === 'patient') navigate('/patient/dashboard');
                else if (response.data.role === 'dentist') navigate('/dentist/dashboard');
                else navigate('/');
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const specializations = [
        'General Dentistry', 'Orthodontics', 'Periodontics', 'Prosthodontics', 'Oral Surgery'
    ];

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
                                Create Your Account
                            </h1>
                            <p className="text-xs text-blue-100 leading-relaxed">
                                Join our clinic system to manage your appointments, view treatment records, and connect with dental professionals.
                            </p>
                        </div>
                    </div>

                    {/* Decorative Image Container */}
                    <div className="mt-6 relative z-10 w-full h-32 rounded-lg overflow-hidden border border-blue-400/30 shadow-inner">
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

                    <div className="mt-6 pt-4 border-t border-blue-500/50 relative z-10">
                        <p className="text-[11px] text-blue-100 mb-2">Already registered with us?</p>
                        <Link to="/login" className="inline-flex w-full items-center justify-center py-1.5 px-4 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors text-[13px]">
                            Sign In to Portal
                        </Link>
                    </div>
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
                            <h2 className="text-xl font-bold text-gray-900">Register</h2>
                            <p className="text-[11px] text-gray-500 mt-0.5">Please fill in your details to create an account.</p>
                        </header>

                        {/* Role Switcher */}
                        <div className="bg-gray-100 p-1 rounded-md flex mb-4">
                            <button
                                type="button"
                                onClick={() => setActiveRole('patient')}
                                className={`flex-1 py-1 text-[11px] font-semibold rounded transition-colors ${activeRole === 'patient' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Patient
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveRole('dentist')}
                                className={`flex-1 py-1 text-[11px] font-semibold rounded transition-colors ${activeRole === 'dentist' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Dentist
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-[11px] font-medium">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm"
                                    placeholder={activeRole === 'dentist' ? "Dr. Full Name" : "John Doe"} required
                                />
                            </div>

                            {activeRole === 'dentist' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">SLMC Number</label>
                                        <input type="text" name="slmcNumber" value={formData.slmcNumber} onChange={handleInputChange} className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm" placeholder="SLMC-XXXX" required />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Specialization</label>
                                        <div className="relative">
                                            <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm appearance-none" required>
                                                <option value="">Select</option>
                                                {specializations.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Phone Number</label>
                                <input
                                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm"
                                    placeholder="077 XXX XXXX" required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors text-sm pr-10"
                                        placeholder="••••••••" required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1">
                                        {showPassword ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full py-1.5 mt-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                            >
                                {loading ? 'Processing...' : 'Create Account'}
                            </button>
                        </form>
                        
                        {/* Mobile Sign In Link */}
                        <div className="md:hidden mt-5 pt-4 border-t border-gray-100 text-center">
                            <p className="text-[11px] text-gray-600">
                                Already registered? <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
