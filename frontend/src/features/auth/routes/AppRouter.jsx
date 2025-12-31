import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';

export const AuthRoutes = ({ onLoginSuccess }) => {
  const { login, loading, error } = useAuth();

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <Routes>
      <Route 
        path="login" 
        element={<LoginPage onLogin={handleLogin} loading={loading} error={error} />} 
      />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;