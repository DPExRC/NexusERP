import React, { useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Componente Lateral */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Área de Contenido Derecha */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Componente Superior */}
        <Navbar isOpen={isSidebarOpen} />

        {/* Contenido Dinámico de la Página */}
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