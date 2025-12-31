import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
      username,
      password,
    });
    
    // Si el backend responde con éxito, guardamos el token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // Lanzamos el error para que el componente lo capture
    throw error.response?.data?.error || 'Error al conectar con el servidor';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');