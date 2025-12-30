import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  Mail, 
  Calendar,
  Circle
} from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulación de carga de datos (Sustituir por tu fetch real)
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Jordan Belfort', email: 'jordan@stratton.com', role: 'CEO', status: 'Activo', joinDate: '2023-01-15' },
      { id: 2, name: 'Donnie Azoff', email: 'donnie@stratton.com', role: 'Partner', status: 'Activo', joinDate: '2023-02-10' },
      { id: 3, name: 'Naomi Lapaglia', email: 'naomi@stratton.com', role: 'Manager', status: 'Inactivo', joinDate: '2023-03-05' },
    ];
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="mx-auto max-w-full">
        
        {/* Header Estilo ERP */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Directorio de Usuarios</h1>
              <p className="text-xs text-slate-500 font-medium">Administra los accesos y roles de la organización</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar usuario..." 
                className="bg-transparent border-none outline-none text-xs text-slate-600 w-40 md:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-md shadow-indigo-100">
              <UserPlus size={16} />
              NUEVO USUARIO
            </button>
          </div>
        </div>

        {/* Contenedor de Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Usuario</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Rol / Cargo</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Estado</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fecha Ingreso</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-indigo-500" />
                        <span className="text-sm font-medium text-slate-600">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'Activo' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        <Circle size={8} fill="currentColor" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-indigo-600">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer de la tabla (opcional) */}
          <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[11px] text-slate-500 font-medium">Mostrando {users.length} usuarios</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-50">Anterior</button>
              <button className="px-3 py-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;