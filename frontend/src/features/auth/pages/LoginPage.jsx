import React from 'react';
import { LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ onLogin, loading, error }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden">
      
      {/* Luces de fondo ambientales (Glow effects) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Contenedor Principal con Glassmorphism */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo y Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
            <LayoutDashboard size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Nexus<span className="text-indigo-500">ERP</span>
          </h1>
        </div>

        {/* Tarjeta de Cristal */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white text-center">Iniciar Sesión</h2>
          </div>

          {/* Tu componente LoginForm */}
          <LoginForm onLogin={onLogin} loading={loading} error={error} />
        </div>

        {/* Footer del Login */}
        <div className="mt-8 flex justify-center gap-6 text-slate-500">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>AES-256 Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <Zap size={14} className="text-indigo-400" />
            <span>Ultra Fast Access</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default LoginPage;