import React, { useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';

const MainLayout = ({ children, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      {/* Pasamos onLogout al Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Pasamos onLogout al Navbar por si quieres un botón de salida allí también */}
        <Navbar isOpen={isSidebarOpen} onLogout={onLogout} />

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