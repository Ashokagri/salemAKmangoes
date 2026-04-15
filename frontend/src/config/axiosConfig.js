import axios from 'axios';

// Set up axios default configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

console.log('API Base URL:', API_URL);
