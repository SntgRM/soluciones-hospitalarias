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
export const getPedidosAll = async (page = 1) => {
    const response = await api.get(`bodega/showall/?page=${page}`);
    return response.data;
};

export const getPedidoDetail = async (pk) => {
    const response = await api.get(`bodega/show/${pk}/`);
    return response.data.results;
};

export const createPedido = async (pedidoData) => {
    const response = await api.post('bodega/create/', pedidoData);
    return response.data.results;
};

export const updatePedido = async (pk, pedidoData) => {
    const response = await api.put(`bodega/update/${pk}/`, pedidoData);
    return response.data.results;
};

export const deletePedido = async (pk) => {
    await api.delete(`bodega/delete/${pk}/`);
};

export const getResumenPedidos = async () => {
  try {
    const response = await api.get('bodega/resumenestados/');
    return response.data;
  } catch (error) {
    console.error("Error en getResumenPedidos:", error);
    throw error;
  }
};

export const getPedidosPorEstado = async (id_estado, page = 1) => {
    const response = await api.get(`bodega/por_estado/${id_estado}/?page=${page}`);
    return response.data;
};

export const getPedidosPorTransportadora = async (id_transportadora, page = 1) => {
    const response = await api.get(`bodega/por_transportadora/${id_transportadora}/?page=${page}`);
    return response.data;
};

export const getClientes = async (search = "") => {
    const response = await api.get(`bodega/clientesall/?search=${encodeURIComponent(search)}`);
    return response.data;
};

export const createCliente = async (clienteData) => {
    const response = await api.post('bodega/clientecreate/', clienteData);
    return response.data.results;
};

export const getAlistadores = async () => {
    const response = await api.get('bodega/alistadoresview/');
    return response.data.results;
};

export const alistadorescreate = async (alistadordata) => {
    const response = await api.post('bodega/alistadorescreate/', alistadordata);
    return response.data.results;
}

export const getEmpacadores = async () => {
    const response = await api.get('bodega/empacadoresview/');
    return response.data.results;
}

export const empacadoresCreate = async (empacadordata) => {
    const response = await api.post('bodega/empacadorescreate/', empacadordata);
    return response.data.results;
}

export const getEnrutadores = async () => {
    const response = await api.get('bodega/enrutadoresview/');
    return response.data.results;
}

export const enrutadoresCreate = async (enrutadordata) => {
    const response = await api.post('bodega/enrutadorescreate/', enrutadordata);
    return response.data.results;
}

export const getTransportadoras = async () => {
    const response = await api.get('bodega/transportadorasview/');
    return response.data.results;
}

export const transportadorasCreate = async (transportadoradata) => {
    const response = await api.post('bodega/transportadorascreate/', transportadoradata);
    return response.data.results;
}

export const getVendedores= async () => {
    const response = await api.get('bodega/vendedoresview/');
    return response.data.results;
}

export const vendedoresCreate = async (vendedordata) => {
    const response = await api.post('bodega/vendedorescreate/', vendedordata);
    return response.data.results;
}

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