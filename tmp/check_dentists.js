import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

async function checkDentists() {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/dentists`);
        console.log('Dentists in DB:');
        data.forEach(d => {
            console.log(`- ID: ${d._id}, Name: ${d.fullName}, Spec: ${d.specialization}`);
        });
    } catch (err) {
        console.error('Error fetching dentists:', err.message);
    }
}

checkDentists();
