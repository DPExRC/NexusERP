import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Quitamos BrowserRouter
import ExcelPage from '../pages/ExcelPage';
import UsersPage from '../pages/UsuariosPage';

const AppRouter = () => {
  return (
    // Quitamos la etiqueta <BrowserRouter> de aquí
    <Routes>
      {/* Ruta principal que carga tu módulo de Excel */}
      <Route path="/excel" element={<ExcelPage />} />

      <Route path="/usuarios" element={<UsersPage />} />  
      
      {/* Ruta por defecto: si entras a "/", te redirige a "/excel" */}
      <Route path="/" element={<Navigate to="/excel" />} />

      {/* Ruta para error 404 */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <h2 className="text-2xl font-bold">404</h2>
          <p>Página no encontrada</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRouter;