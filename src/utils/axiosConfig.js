import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      
      const inner401 = error.response.status === 500 && typeof error.response.data?.error === 'string' && error.response.data.error.includes('401');
      if (error.response.status === 401 || inner401) {
        const errMsg = error.response.data?.error || error.response.data?.message || 'Session expired';
       
        toast.error(`${errMsg}. Please log in again.`, { autoClose: 4000 });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
