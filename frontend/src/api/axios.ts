import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            console.error('Authentication error:', error);
            console.error('Response headers:', error.response.headers);
            console.error('Request config:', error.config);
        }
        return Promise.reject(error);
    }
);

export default api; 