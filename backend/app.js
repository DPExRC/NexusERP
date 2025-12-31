import express from 'express';
import cors from 'cors';
// Asegúrate de importar tus rutas aquí
import authRoutes from './src/api/routes/v1/authRoutes.js'; 

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// --- LA CLAVE ESTÁ AQUÍ ---
// El frontend busca /api/v1/auth/login, así que montamos las rutas así:
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API de NexusERP funcionando correctamente');
});

export default app;