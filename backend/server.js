import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importación de rutas y middlewares
import authRoutes from './src/api/routes/v1/authRoutes.js';
import excelRoutes from './src/api/routes/v1/excelRoutes.js';
import { verificarToken } from './src/api/middlewares/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS Profesional
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- RUTAS ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/excel', verificarToken, excelRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});