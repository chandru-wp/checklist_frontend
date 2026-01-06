import axios from 'axios';

const API_BASE_URL = 'https://checklist-backend-098h.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add interceptor for token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
export { API_BASE_URL };
