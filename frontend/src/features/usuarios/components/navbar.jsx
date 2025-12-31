import React from 'react';

const Navbar = ({ isOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm w-full">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar datos..." 
            className="bg-slate-100 border-none rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 w-64 hidden md:block"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800 leading-none">David Administrador</p>
          <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Conectado</p>
        </div>
        <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white">
          D
        </div>
      </div>
    </header>
  );
};

export default Navbar;