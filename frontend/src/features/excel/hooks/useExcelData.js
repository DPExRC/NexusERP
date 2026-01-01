import { useState, useEffect } from 'react';
import { excelService } from '../services/excelService';

export const useExcelData = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      const result = await excelService.getAll();
      if (result.headers) setHeaders(result.headers);
      if (result.data) setData(result.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdate = async (rowIndex, columnName, value) => {
    try {
      const response = await excelService.updateCell(rowIndex, columnName, value);
      if (response.ok) {
        const newData = [...data];
        newData[rowIndex][columnName] = value;
        setData(newData);
        return true;
      }
    } catch (error) { return false; }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await excelService.upload(file);
      if (response.ok) await loadData();
    } finally {
      setUploading(false);
    }
  };

  return { data, headers, loading, uploading, handleUpdate, handleUpload };
};