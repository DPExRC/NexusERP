import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  UploadCloud, 
  History, 
  PieChart, 
  FileText,
  Users,
  Menu,
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  const handleSubmenuToggle = (label) => {
    if (!isOpen) return;
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen border-r border-slate-800`}>
      {/* Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="bg-indigo-500 p-2 rounded-lg mr-3">
          <LayoutDashboard size={24} className="text-white" />
        </div>
        {isOpen && <span className="text-xl font-bold tracking-tight">Nexus<span className="text-indigo-400">ERP</span></span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 custom-scrollbar">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          isOpen={isOpen} 
          to="/" 
          active={location.pathname === '/'} 
        />
        
        <NavGroup 
          icon={<FileSpreadsheet size={20} />} 
          label="Gestión Excel" 
          isOpen={isOpen}
          isExpanded={openSubmenu === 'Excel'}
          onToggle={() => handleSubmenuToggle('Excel')}
          subItems={[
            { label: 'Explorar Datos', icon: <FileSpreadsheet size={18} />, to: '/excel' },
            { label: 'Subir Archivo', icon: <UploadCloud size={18} />, to: '/upload' },
            { label: 'Historial', icon: <History size={18} />, to: '/history' },
          ]}
        />

        <NavGroup 
          icon={<BarChart3 size={20} />} 
          label="Analítica" 
          isOpen={isOpen}
          isExpanded={openSubmenu === 'Analytics'}
          onToggle={() => handleSubmenuToggle('Analytics')}
          subItems={[
            { label: 'Reporte de Ventas', icon: <PieChart size={18} />, to: '/analytics/sales' },
            { label: 'Documentos PDF', icon: <FileText size={18} />, to: '/analytics/docs' },
          ]}
        />

        <NavItem 
          icon={<Users size={20} />} 
          label="Usuarios" 
          isOpen={isOpen} 
          to="/usuarios" 
          active={location.pathname === '/usuarios'} 
        />
        
        <NavItem 
          icon={<Settings size={20} />} 
          label="Configuración" 
          isOpen={isOpen} 
          to="/settings" 
          active={location.pathname === '/settings'} 
        />
      </nav>

      {/* Footer Section: Log Out & Toggle */}
      <div className="p-3 bg-slate-950/50 space-y-1">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <span className="shrink-0">
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          </span>
          {isOpen && <span className="text-sm font-semibold tracking-wide">Cerrar Sesión</span>}
        </button>

        <button 
          onClick={toggleSidebar}
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Menu size={20} />
          {isOpen && <span className="text-sm font-semibold">Contraer menú</span>}
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, isOpen, active, to }) => (
  <Link to={to} className={`
    flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
    ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `}>
    <span className="shrink-0">{icon}</span>
    {isOpen && <span className="text-sm font-semibold tracking-wide">{label}</span>}
  </Link>
);

const NavGroup = ({ icon, label, isOpen, subItems, isExpanded, onToggle }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col">
      <div 
        onClick={onToggle}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
          ${isExpanded ? 'text-white bg-slate-800/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
        `}
      >
        <div className="flex items-center gap-4">
          <span className="shrink-0">{icon}</span>
          {isOpen && <span className="text-sm font-semibold tracking-wide">{label}</span>}
        </div>
        {isOpen && (
          <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </div>
      {isOpen && isExpanded && (
        <div className="mt-1 space-y-1">
          {subItems.map((item, idx) => (
            <Link 
              key={idx}
              to={item.to}
              className={`flex items-center gap-4 px-12 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium
                ${location.pathname === item.to ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;