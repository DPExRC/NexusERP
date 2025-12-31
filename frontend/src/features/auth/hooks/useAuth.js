import { useState } from 'react';
import { loginUser, logout as serviceLogout } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(username, password);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    serviceLogout();
    window.location.reload(); // Recarga para limpiar el estado de la app
  };

  return { login, logout, loading, error };
};