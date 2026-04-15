import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default axiosInstance;
