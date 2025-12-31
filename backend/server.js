import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importación de rutas y middlewares
import authRoutes from './src/api/routes/v1/authRoutes.js';
import excelRoutes from './src/api/routes/v1/excelRoutes.js';
import { verificarToken } from './src/api/middlewares/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS con tu frontend de Vercel incluido
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://nexus-erp-coral.vercel.app', // ⭐ AGREGADO
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origen bloqueado:', origin);
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manejo explícito de OPTIONS (preflight)
app.options('*', cors());

app.use(express.json());

// Logging para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});

// --- RUTAS ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/excel', verificarToken, excelRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API de NexusERP funcionando',
    allowedOrigins: allowedOrigins 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  console.log('✅ Orígenes permitidos:', allowedOrigins);
});