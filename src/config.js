// This dynamically determines the backend URL based on where the frontend is loaded from.
// If you access the site via 'localhost', it will talk to 'localhost:5000'.
// If you access via '192.168.1.5', it will talk to '192.168.1.5:5000'.

const hostname = window.location.hostname;

// Use 'https' if the page is secure, otherwise 'http'
const protocol = window.location.protocol;

// Backend always runs on port 5000
export const API_BASE_URL = `${protocol}//${hostname}:5000`;

console.log('API Configured to:', API_BASE_URL);

export default API_BASE_URL;
