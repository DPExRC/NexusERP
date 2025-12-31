import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UsersPage from '../pages/UsuariosPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta principal del módulo Usuarios */}
      <Route path="/" element={<UsersPage />} />
      
      {/* Otras rutas del módulo si las necesitas xd*/}
      {/* <Route path="/crear" element={<CrearUsuarioPage />} /> */}
      {/* <Route path="/:id" element={<DetalleUsuarioPage />} /> */}
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;