import axios from 'axios';

const test = async () => {
    try {
        console.log('Testing login...');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'mitchell@dentalign.com',
            password: 'password123',
            role: 'dentist'
        });
        console.log('SUCCESS:', res.data.fullName, 'Role:', res.data.role);
    } catch (e) {
        console.error('FAIL:', e.response?.data?.message || e.message);
    }
};
test();
