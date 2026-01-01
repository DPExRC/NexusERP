import React, { useState } from 'react';
import { Database, Upload } from 'lucide-react';

export const ExcelHeader = ({ onUpload, uploading }) => {
  const [file, setFile] = useState(null);

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
          <Database className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Data Explorer</h1>
          <p className="text-xs text-slate-500 font-medium">Gestión y edición en tiempo real</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
          <Upload size={16} className="text-indigo-600" />
          <span className="text-xs font-semibold text-slate-600">
            {file ? file.name : "Seleccionar Excel"}
          </span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button
          onClick={() => { onUpload(file); setFile(null); }}
          disabled={!file || uploading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
        >
          {uploading ? 'PROCESANDO...' : 'SINCRONIZAR'}
        </button>
      </div>
    </div>
  );
};