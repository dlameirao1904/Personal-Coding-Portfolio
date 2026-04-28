import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = useAuthStore().getToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default instance;
