import axios from 'axios';

const testRegistration = async () => {
    const API_BASE_URL = 'http://localhost:5000';
    try {
        console.log('--- Testing Patient Registration ---');
        const patientRes = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            fullName: 'Test Patient',
            email: `test_p_${Date.now()}@test.com`,
            phone: '0771234567',
            password: 'password123',
            role: 'patient'
        });
        console.log('✅ Patient Registration Success:', patientRes.data.patientId);

        console.log('--- Testing Dentist Registration ---');
        const dentistRes = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            fullName: 'Dr. Test Dentist',
            email: `test_d_${Date.now()}@test.com`,
            phone: '0777654321',
            password: 'password123',
            role: 'dentist',
            slmcNumber: 'SLMC-TEST-' + Date.now(),
            specialization: 'General Dentistry'
        });
        console.log('✅ Dentist Registration Success:', dentistRes.data.patientId);

    } catch (error) {
        console.error('❌ Registration Failed:', error.response?.data || error.message);
    }
};

testRegistration();
