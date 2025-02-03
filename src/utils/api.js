import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
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

// Response interceptor for handling errors and logging
api.interceptors.response.use(
    (response) => {
        // Log successful responses for debugging
        console.log('API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data
        });
        
        return response;
    },
    (error) => {
        // Log error responses for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });

        // If it's a Bad Request (400), log more details
        if (error.response?.status === 400) {
            console.log('Bad Request:', error.response.data);
        }

        // If it's an Unauthorized error (401), redirect to login
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            // Redirect to login page
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
