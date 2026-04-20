import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux';
import { store } from './app/store.js';
import {ToastContainer} from 'react-toastify';
import axios from 'axios';

// Configure axios for production/development
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
    <App />
    <ToastContainer/>
    </Provider>
  // </StrictMode>,
)
