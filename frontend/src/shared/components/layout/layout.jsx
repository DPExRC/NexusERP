import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';

const MainLayout = ({ children, onLogout }) => {
  // 1. Inicializamos según el ancho de pantalla (menor a 768px = móvil)
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      // 2. Si el usuario achica la ventana o usa un celular, cerramos automáticamente
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpieza al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} // Te sugiero pasar esto para tener un botón "hamburguesa" en el navbar móvil
          onLogout={onLogout} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;