import apiClient from '@/config/api';

export const loginUser = async (username, password) => {
  try {
    // 1. Usamos apiClient (ya tiene la base URL y /api/v1 configurados)
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });
    
    // 2. Guardamos el token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // 3. El error ya viene formateado por el interceptor de apiClient
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  // Opcional: Redirigir al login
  window.location.href = '/auth/login';
};

export const getToken = () => localStorage.getItem('token');