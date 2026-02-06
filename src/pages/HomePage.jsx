import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section - Compact */}
            <section className="px-4 py-8 md:py-12 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            <span>✨</span> Premium Dental Care
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                            Your Perfect <span className="text-blue-600">Smile</span> Starts Here
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            Modern dental care with advanced technology. Book appointments, track treatments, and manage your oral health.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all text-sm">
                                Get Started
                            </Link>
                            <Link to="/login" className="px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition-all border-2 border-gray-200 text-sm">
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600"
                                alt="Dental Care"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-white p-3 rounded-xl shadow-lg">
                            <div className="text-2xl font-black text-blue-600">99%</div>
                            <div className="text-xs font-bold text-gray-500">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats - Compact */}
            <section className="px-4 py-6 md:py-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { num: '5+', label: 'Years' },
                        { num: '2.5k+', label: 'Patients' },
                        { num: '24/7', label: 'Support' },
                        { num: 'ISO', label: 'Certified' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <div className="text-xl md:text-2xl font-black text-gray-900">{stat.num}</div>
                            <div className="text-xs font-bold text-gray-500 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features - Compact */}
            <section className="px-4 py-6 md:py-8 max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-center mb-6">Why Choose Us?</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { icon: '🗓️', title: 'Easy Booking', desc: 'Schedule in seconds' },
                        { icon: '📊', title: 'Digital Records', desc: 'Access anytime' },
                        { icon: '💳', title: 'Secure Payments', desc: 'Safe transactions' }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
                            <div className="text-3xl mb-2">{feature.icon}</div>
                            <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                            <p className="text-xs text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Us - Compact */}
            <section id="about" className="px-4 py-8 md:py-12 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black mb-4 text-center">About DentAlign</h2>
                    <p className="text-sm md:text-base text-gray-700 text-center max-w-3xl mx-auto mb-6">
                        Modern dental management system combining cutting-edge technology with user-friendly design.
                        From online booking to digital treatment records, every feature is built for your comfort.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: '👨‍⚕️', title: 'Expert Dentists' },
                            { icon: '🏥', title: 'Modern Facility' },
                            { icon: '⏰', title: 'Flexible Hours' },
                            { icon: '💰', title: 'Clear Pricing' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow text-center">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h4 className="font-bold text-sm">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - Compact */}
            <section className="px-4 py-8 md:py-12 max-w-6xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to Transform Your Smile?</h2>
                    <p className="text-blue-100 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                        Join thousands of satisfied patients. Book your appointment today.
                    </p>
                    <Link to="/register" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all text-sm md:text-base">
                        Book Appointment Now
                    </Link>
                </div>
            </section>

            {/* Footer - Compact */}
            <footer className="px-4 py-6 border-t border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                            <span className="font-bold">DentAlign</span>
                        </div>
                        <div className="text-xs text-gray-600">
                            © 2024 DentAlign. All rights reserved.
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600">
                            <a href="#about" className="hover:text-blue-600">About</a>
                            <Link to="/login" className="hover:text-blue-600">Login</Link>
                            <Link to="/register" className="hover:text-blue-600">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
