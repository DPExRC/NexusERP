import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthRoutes from '@features/auth/routes/AppRouter';
import ExcelRouter from '@features/excel/routes/AppRouter';
import UsuariosRouter from '@features/usuarios/routes/AppRouter';
import MainLayout from '@shared/components/layout/layout';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => setIsAuth(true);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación (SIN layout) */}
        <Route 
          path="/auth/*" 
          element={
            isAuth ? (
              <Navigate to="/excel" replace />
            ) : (
              <AuthRoutes onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />

        {/* Rutas protegidas CON layout compartido */}
        <Route 
          path="/*" 
          element={
            isAuth ? (
              <MainLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="/excel/*" element={<ExcelRouter />} />
                  <Route path="/usuarios/*" element={<UsuariosRouter />} />
                  <Route path="/" element={<Navigate to="/excel" replace />} />
                  <Route path="*" element={<Navigate to="/excel" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/auth/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;