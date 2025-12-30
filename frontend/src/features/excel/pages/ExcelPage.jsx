import React, { useState, useEffect } from 'react';
import { Table, Upload, Database, FileSpreadsheet, AlertCircle } from 'lucide-react';

const ExcelPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const fetchExcelData = async () => {
    try {
      const response = await fetch(`${API_URL}/get-excel`);
      const result = await response.json();
      if (result.headers) setHeaders(result.headers);
      if (result.data) setData(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExcelData(); }, []);

  const saveChange = async () => {
    if (!editingCell) return;
    const { rowIndex, columnName, value } = editingCell;
    if (data[rowIndex][columnName] === value) {
      setEditingCell(null);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/update-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex, columnName, newValue: value }),
      });
      if (response.ok) {
        const newData = [...data];
        newData[rowIndex][columnName] = value;
        setData(newData);
        setEditingCell(null);
      }
    } catch (error) {
      setEditingCell(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/upload-excel`, { method: 'POST', body: formData });
      if (response.ok) fetchExcelData();
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="mx-auto max-w-full">

        {/* Header del ERP */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
              <Database className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Data Explorer</h1>
              <p className="text-xs text-slate-500 font-medium">Gestión y edición de registros en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
              <Upload size={16} className="text-indigo-600" />
              <span className="text-xs font-semibold text-slate-600">{file ? file.name : "Seleccionar Excel"}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button
              onClick={handleFileUpload}
              disabled={!file || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
            >
              {uploading ? 'PROCESANDO...' : 'SINCRONIZAR'}
            </button>
          </div>
        </div>

        {/* Contenedor de Tabla estilo ERP */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {headers.map((h) => (
                    <th key={h.name} className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 group">
                        <FileSpreadsheet size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                          {h.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length > 0 ? data.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="hover:bg-indigo-50/30 transition-colors group">
                    {headers.map((header) => {
                      const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnName === header.name;

                      return (
                        <td
                          key={`cell-${rowIndex}-${header.name}`}
                          className={`px-6 py-3.5 text-sm transition-all border-transparent border ${isEditing ? 'bg-indigo-50/50' : ''
                            }`}
                          onDoubleClick={() => setEditingCell({ rowIndex, columnName: header.name, value: row[header.name] })}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-full bg-transparent outline-none text-sm font-medium text-indigo-700 border-b-2 border-indigo-500 pb-0.5"
                              value={editingCell.value || ''}
                              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                              onBlur={saveChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveChange();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                            />
                          ) : (
                            <div className="min-h-[20px] text-slate-600 font-medium cursor-cell truncate max-w-[200px]">
                              {row[header.name] || <span className="text-slate-300 italic text-xs">Vacío</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={headers.length} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <AlertCircle size={48} />
                        <p className="text-sm font-bold">No hay datos disponibles. Importa un archivo para comenzar.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelPage;