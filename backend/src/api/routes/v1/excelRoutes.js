import express from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import pool from '../../../db.js'; // Asegúrate de que apunte correctamente a tu db.js

const router = express.Router();

// Configuración de Multer para procesar el archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });

// 1. OBTENER DATOS (GET)
// Ahora bajo la ruta: /api/v1/excel/get-excel
router.get('/get-excel', async (req, res) => {
  try {
    // Obtenemos el registro más reciente basado en el ID
    const result = await pool.query('SELECT datos FROM excel_data ');
    
    if (result.rows.length === 0) {
      return res.json({ data: [], headers: [] });
    }

    const jsonData = result.rows[0].datos; // Extraemos el array del JSONB

    // Generamos los headers dinámicamente según las llaves del JSON
    const headers = jsonData.length > 0 
      ? Object.keys(jsonData[0]).map((key, index) => ({ name: key, index }))
      : [];

    res.json({ data: jsonData, headers });
  } catch (error) {
    console.error("Error en GET-EXCEL:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. SUBIR EXCEL (POST)
// Ahora bajo la ruta: /api/v1/excel/upload-excel
router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

    const nombreArchivo = req.file.originalname;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Persistencia: Inserta o actualiza si el nombre del archivo ya existe
    const query = `
      INSERT INTO excel_data (nombre_archivo, datos)
      VALUES ($1, $2)
      ON CONFLICT (nombre_archivo) 
      DO UPDATE SET 
        datos = EXCLUDED.datos,
        ultima_actualizacion = CURRENT_TIMESTAMP;
    `;

    await pool.query(query, [nombreArchivo, JSON.stringify(jsonData)]);

    const headers = jsonData.length > 0 
      ? Object.keys(jsonData[0]).map((key, index) => ({ name: key, index }))
      : [];

    res.json({ 
      message: "Sincronización exitosa", 
      rows: jsonData.length, 
      headers 
    });

  } catch (error) {
    console.error("Error en UPLOAD:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. ACTUALIZAR CELDA ESPECÍFICA (POST)
// Ahora bajo la ruta: /api/v1/excel/update-excel
router.post('/update-excel', async (req, res) => {
  const { rowIndex, columnName, newValue } = req.body;

  try {
    // Buscamos el último archivo trabajado
    const result = await pool.query('SELECT nombre_archivo, datos FROM excel_data');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No hay datos para actualizar" });
    }

    const nombreArchivo = result.rows[0].nombre_archivo;
    let datos = result.rows[0].datos;

    // Modificamos el valor en el array
    if (datos[rowIndex]) {
      datos[rowIndex][columnName] = newValue;
    } else {
      return res.status(400).json({ error: "Fila no encontrada" });
    }

    // Guardamos el JSON actualizado
    await pool.query(
      'UPDATE excel_data SET datos = $1, ultima_actualizacion = CURRENT_TIMESTAMP WHERE nombre_archivo = $2',
      [JSON.stringify(datos), nombreArchivo]
    );

    res.json({ message: "Celda actualizada correctamente" });
  } catch (error) {
    console.error("Error en UPDATE:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. LIMPIAR TODO (DELETE)
// Ahora bajo la ruta: /api/v1/excel/clear-excel
router.delete('/clear-excel', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE excel_data RESTART IDENTITY');
    res.json({ message: "Base de datos limpiada por completo" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;