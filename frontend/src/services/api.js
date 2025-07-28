import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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

// Funciones para los endpoints de Pedidos
export const getPedidosAll = async () => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.get('bodega/showall/');
    return response.data.results;
};

export const getPedidoDetail = async (pk) => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.get(`bodega/show/${pk}/`);
    return response.data.results;
};

export const createPedido = async (pedidoData) => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.post('bodega/create/', pedidoData);
    return response.data.results;
};

export const updatePedido = async (pk, pedidoData) => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.put(`bodega/update/${pk}/`, pedidoData);
    return response.data.results;
};

export const deletePedido = async (pk) => {
    // CORREGIDO: Eliminado el 'api/' redundante
    await api.delete(`bodega/delete/${pk}/`);
};

export const getResumenPedidos = async () => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.get('bodega/resumenestados/');
    return response.data.results;
};

export const getPedidosPorEstado = async (id_estado) => {
    const response = await api.get(`bodega/por_estado/${id_estado}/`);
    return response.data.results;
};

export const getPedidosPorTransportadora = async (id_transportadora) => {
    // CORREGIDO: Eliminado el 'api/' redundante
    const response = await api.get(`bodega/por_transportadora/${id_transportadora}/`);
    return response.data.results;
};


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

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// Funciones de autenticación
export const authAPI = {
    login: async (credentials) => {

        const response = await api.post('auth/login/', credentials); 
        return response.data.results;
    },
    
    logout: async () => {

        const response = await api.post('auth/logout/');
        return response.data.results;
    },
    
    getProfile: async () => {

        const response = await api.get('auth/profile/');
        return response.data;
    },
    
    register: async (userData) => {

        const response = await api.post('auth/register/', userData);
        return response.data.results;
    }
};

export const getUsers = async () => {
    const response = await api.get('auth/users/');
    return response.data.results;
};

export const createUser = async (userData) => {
    const dataToSend = {
        username: userData.username,
        first_name: userData.first_name,
        role: userData.role,
        password: userData.password
    };

    const response = await api.post('/auth/users/', dataToSend);
    return response.data.results;
};

export const updateUser = async (userId, userData) => {
    const dataToSend = {
        username: userData.username,
        first_name: userData.first_name,
        role: userData.role
    };

    const response = await api.patch(`/auth/users/${userId}/`, dataToSend);
    return response.data.results;
};

// Nuevas funciones para datos con archivos
export const createUserWithFile = async (formData) => {
    const response = await api.post('/auth/users/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data.results;
};

export const updateUserWithFile = async (userId, formData) => {
    const response = await api.patch(`/auth/users/${userId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data.results;
};

export const deleteUser = async (userId) => {
    await api.delete(`auth/users/${userId}/`);
};

export const processImageFile = async (file) => {
    if (!file) return null;

    if (!file.type.startsWith('image/')) {
        throw new Error('Por favor selecciona un archivo de imagen válido');
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen debe ser menor a 5MB');
    }

    return await fileToBase64(file);
};

export default api;