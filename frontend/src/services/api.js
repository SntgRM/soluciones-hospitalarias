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
export const getPedidosAll = async (page = 1, search = "") => {
    const response = await api.get(`bodega/showall/?page=${page}&search=${encodeURIComponent(search)}`);
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


export const updatePedido = async (id_factura, data) => {
    try {
        
        // Limpiar datos undefined, null o vacíos antes de enviar
        const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                // Convertir strings de números a números si es necesario
                if (key === 'valor' || key === 'recaudo_efectivo' || key === 'recaudo_transferencia') {
                    acc[key] = parseFloat(value) || 0;
                } else if (key.includes('id_') && value) {
                    // Asegurar que los IDs sean números enteros
                    acc[key] = parseInt(value) || value;
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});

        const response = await api.put(`bodega/update/${id_factura}/`, cleanedData);
  
        return response.data.results || response.data.data || response.data || data;
    } catch (error) {
        console.error('Error completo en updatePedido:', error);
        console.error('Error response:', error.response);
        console.error('Error request:', error.request);
        
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
            
            // IMPORTANTE: Crear un nuevo error que incluya la data del response
            const newError = new Error(`Error ${error.response.status}: ${error.response.statusText}`);
            newError.response = error.response; // Preservar la respuesta completa
            throw newError;
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
        } else {
            throw new Error('Error en la petición: ' + error.message);
        }
    }
};

export const getTiposRecaudo = async () => {
    try {
        const response = await api.get('bodega/tipos-recaudo/');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo tipos de recaudo:', error);
        return {
            results: [
                { value: 'efectivo', label: 'Efectivo' },
                { value: 'transferencia', label: 'Transferencia' },
                { value: 'efectivo y transferencia', label: 'Efectivo y Transferencia' }
            ]
        };
    }
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

export const getPedidosPorEstado = async (id_estado, page = 1, search = "") => {
    try {
        // Construir URL con parámetros de paginación y búsqueda
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const url = `bodega/por_estado/${id_estado}/?page=${page}${searchParam}`;
        
        const response = await api.get(url);
        
        if (!response.data) {
            throw new Error('Respuesta inválida del servidor');
        }
        
        return {
            results: response.data.results || [],
            count: response.data.count || 0,
            next: response.data.next,
            previous: response.data.previous
        };
    } catch (error) {
        console.error('Error en getPedidosPorEstado:', error);
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Error de conexión. Verifique su conexión a internet.');
        } else {
            throw new Error(`Error en la petición: ${error.message}`);
        }
    }
};

export const getPedidosPorTransportadora = async (id_transportadora, page = 1, search = "") => {
    const response = await api.get(`bodega/por_transportadora/${id_transportadora}/?page=${page}&search=${encodeURIComponent(search)}`);
    return response.data;
};

export const getHistorialPedidos = async (pk) => {
    const response = await api.get(`bodega/historial_estados/${pk}/`)
    return response.data;
};

export const getHistorialGeneral = async () => {
    const response = await api.get('bodega/historial_general/');
    return response.data;
};

export const getClientes = async (search = "") => {
  const response = await api.get(`bodega/clientesall/?search=${encodeURIComponent(search)}`);

  if (
    Array.isArray(response.data) &&
    response.data.length > 0 &&
    typeof response.data[0] === "number"
  ) {
    const clientesDetallados = await Promise.all(
      response.data.map((id) => api.get(`bodega/clientesdetail/${id}/`))
    );
    return clientesDetallados.map((res) => res.data);
  }

  return response.data;
};


export const createCliente = async (clienteData) => {
    const response = await api.post('bodega/clientecreate/', clienteData);
    return response.data.results;
};

export const getAlistadores = async (search = "") => {
    const response = await api.get(`bodega/alistadoresview/?search=${encodeURIComponent(search)}`);
    return response.data;
};

export const alistadorescreate = async (alistadordata) => {
    const response = await api.post('bodega/alistadorescreate/', alistadordata);
    return response.data.results;
}

export const getEmpacadores = async (search = "") => {
    const response = await api.get(`bodega/empacadoresview/?search=${encodeURIComponent(search)}`);
    return response.data;
}

export const empacadoresCreate = async (empacadordata) => {
    const response = await api.post('bodega/empacadorescreate/', empacadordata);
    return response.data.results;
}

export const getEnrutadores = async (search = "") => {
    const response = await api.get(`bodega/enrutadoresview/?search=${encodeURIComponent(search)}`);
    return response.data;
}

export const enrutadoresCreate = async (enrutadordata) => {
    const response = await api.post('bodega/enrutadorescreate/', enrutadordata);
    return response.data.results;
}

export const getTransportadoras = async (search = "") => {
    const response = await api.get(`bodega/transportadorasview/?search=${encodeURIComponent(search)}`);
    return response.data;
}

export const transportadorasCreate = async (transportadoradata) => {
    const response = await api.post('bodega/transportadorascreate/', transportadoradata);
    return response.data.results;
}

export const getVendedores= async (search = "") => {
    const response = await api.get(`bodega/vendedoresview/?search=${encodeURIComponent(search)}`);
    return response.data;
}

export const vendedoresCreate = async (vendedordata) => {
    const response = await api.post('bodega/vendedorescreate/', vendedordata);
    return response.data.results;
}

export const getEstados = async (search = "") => {
    const response = await api.get(`bodega/estadosview/?search=${encodeURIComponent(search)}`);
    return response.data;
}

export const getResumenFechas = async () => {
    const response = await api.get(`bodega/resumenfechas/`)
    return response.data;
}

export const getAlistadoresResumen = async (period = "month") => {
  try {
    const response = await api.get(`bodega/alistadoresresumen/?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error en getAlistadoresResumen:", error);
    throw error;
  }
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

export const getPedidosWithFilters = async (page = 1, search = "", filters = {}) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        
        if (search) {
            params.append('search', search);
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                params.append(key, value);
            }
        });

        const response = await api.get(`bodega/showall/?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo pedidos con filtros:', error);
        throw error;
    }
};

export const getFilterOptions = async () => {
    const response = await api.get('bodega/filter_options/');
    return response.data;
};

export const getPedidosPorEstadoWithFilters = async (id_estado, page = 1, search = "", filters = {}) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        
        if (search) {
            params.append('search', search);
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                params.append(key, value);
            }
        });

        const response = await api.get(`bodega/por_estado/${id_estado}/?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo pedidos por estado con filtros:', error);
        throw error;
    }
};

export default api;