import express from 'express';
import multer from 'multer';
import * as xlsx from 'xlsx';
import cors from 'cors';
import 'dotenv/config';
import pool from './src/db.js';

const app = express();

// --- CONFIGURACIÓN PARA PRODUCCIÓN ---

// 1. Usa el puerto que te asigne el servidor (Render/Railway) o 4000 por defecto
const PORT = process.env.PORT || 4000;

// 2. Configura CORS para que acepte tu futuro dominio de Vercel
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cambia 5173 si usas otro en local
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- RUTAS (Se mantienen igual, solo una pequeña mejora en el GET) ---

app.get('/api/get-excel', async (req, res) => {
  try {
    // Es mejor pedir el último por fecha si tienes varios
    const result = await pool.query('SELECT datos FROM excel_data ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({ data: [], headers: [] });
    }

    const jsonData = result.rows[0].datos;
    const headers = jsonData.length > 0 
      ? Object.keys(jsonData[0]).map((key, index) => ({ name: key, index }))
      : [];

    res.json({ data: jsonData, headers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// --- Rutas ---

// 1. OBTENER DATOS (GET)
app.get('/api/get-excel', async (req, res) => {
  try {
    // Obtenemos el registro más reciente basado en el nombre del archivo o fecha
    const result = await pool.query('SELECT datos FROM excel_data LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.json({ data: [], headers: [] });
    }

    const jsonData = result.rows[0].datos; // Extraemos el array del JSONB

    const headers = jsonData.length > 0 
      ? Object.keys(jsonData[0]).map((key, index) => ({ name: key, index }))
      : [];

    res.json({ data: jsonData, headers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. SUBIR EXCEL (POST)
app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

    const nombreArchivo = req.file.originalname; // Usamos el nombre como ID único
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // 1. Persistencia: Sincroniza el contenido en una sola fila para este archivo
    const query = `
      INSERT INTO excel_data (nombre_archivo, datos)
      VALUES ($1, $2)
      ON CONFLICT (nombre_archivo) 
      DO UPDATE SET 
        datos = EXCLUDED.datos;
    `;

    // Guardamos el array completo como JSONB
    await pool.query(query, [nombreArchivo, JSON.stringify(jsonData)]);

    // 2. Respuesta: Extraemos los headers para que el Front actualice la tabla
    const headers = jsonData.length > 0 
      ? Object.keys(jsonData[0]).map((key, index) => ({ name: key, index }))
      : [];

    res.json({ 
      message: "Sincronización exitosa", 
      rows: jsonData.length, 
      headers // Enviamos los headers detectados
    });

  } catch (error) {
    console.error("Error en UPLOAD:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. ACTUALIZAR CELDA (POST)
app.post('/api/update-excel', async (req, res) => {
  const { rowIndex, columnName, newValue } = req.body;

  try {
    // 1. Buscamos el archivo más reciente (o podrías pasar el nombre del archivo desde el front)
    const result = await pool.query('SELECT nombre_archivo, datos FROM excel_data LIMIT 1');
    
    if (result.rows.length === 0) return res.status(404).json({ error: "No hay datos para actualizar" });

    const nombreArchivo = result.rows[0].nombre_archivo;
    let datos = result.rows[0].datos; // Este es el array completo del Excel

    // 2. Modificamos el dato en la posición específica del array
    if (datos[rowIndex]) {
      datos[rowIndex][columnName] = newValue;
    } else {
      return res.status(400).json({ error: "Fila no encontrada" });
    }

    // 3. Guardamos el array actualizado de vuelta en la base de datos
    await pool.query(
      'UPDATE excel_data SET datos = $1 WHERE nombre_archivo = $2',
      [JSON.stringify(datos), nombreArchivo]
    );

    res.json({ message: "Celda actualizada correctamente" });
  } catch (error) {
    console.error("Error en UPDATE:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. LIMPIAR TABLA (Opcional - Útil para pruebas)
app.delete('/api/clear-excel', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE excel_data RESTART IDENTITY');
    res.json({ message: "Base de datos limpiada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Excel corriendo en http://localhost:${PORT}`);
});