import axios from 'axios';

// Detectar entorno automáticamente
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// URLs según el entorno
const API_URLS = {
  development: 'http://localhost:4000',
  production: 'https://nexuserp.onrender.com'
};

// Usar la URL del entorno actual o fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isProduction ? API_URLS.production : API_URLS.development);

console.log('🌐 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('🔗 API URL:', API_BASE_URL);

// Instancia de axios configurada
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 segundos
});

// Interceptor de request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log solo en desarrollo
    if (isDevelopment) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response
apiClient.interceptors.response.use(
  (response) => {
    // Log solo en desarrollo
    if (isDevelopment) {
      console.log('📥 Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Manejo de errores mejorado
    if (error.response?.status === 401) {
      console.warn('🔒 Token inválido o expirado');
      localStorage.removeItem('token');
      
      // Solo redirigir si no estamos ya en login
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Log detallado en desarrollo
    if (isDevelopment) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;