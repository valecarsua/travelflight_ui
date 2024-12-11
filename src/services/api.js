import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            localStorage.setItem('session_expired', 'true');
            localStorage.removeItem('access_token');
            window.location.href = '/';
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;