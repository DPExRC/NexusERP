import React, { useState } from 'react';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useExcelData } from '../hooks/useExcelData';
import { ExcelHeader } from '@features/excel/components/ExcelHeader';

const ExcelPage = () => {
  const { data, headers, uploading, handleUpdate, handleUpload } = useExcelData();
  const [editingCell, setEditingCell] = useState(null);

  const onSaveChange = async () => {
    if (!editingCell) return;
    const success = await handleUpdate(editingCell.rowIndex, editingCell.columnName, editingCell.value);
    if (success) setEditingCell(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="mx-auto max-w-full">
        <ExcelHeader onUpload={handleUpload} uploading={uploading} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {headers.map((h) => (
                    <th key={h.name} className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 group">
                        <FileSpreadsheet size={14} className="text-slate-400 group-hover:text-indigo-500" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{h.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-indigo-50/30 group">
                    {headers.map((header) => {
                      const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnName === header.name;
                      return (
                        <td 
                          key={header.name} 
                          className="px-6 py-3.5 text-sm"
                          onDoubleClick={() => setEditingCell({ rowIndex, columnName: header.name, value: row[header.name] })}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-full bg-transparent outline-none text-indigo-700 border-b-2 border-indigo-500"
                              value={editingCell.value || ''}
                              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                              onBlur={onSaveChange}
                              onKeyDown={(e) => e.key === 'Enter' && onSaveChange()}
                            />
                          ) : (
                            <div className="truncate max-w-[200px] text-slate-600 font-medium">
                              {row[header.name] || <span className="text-slate-300 italic text-xs">Vacío</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelPage;