import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido, limpiar localStorage y redirigir al login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Funciones de autenticación
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login/', credentials);
        return response.data;
    },
    
    logout: async () => {
        const response = await api.post('/auth/logout/');
        return response.data;
    },
    
    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },
    
    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    }
};

export default api;