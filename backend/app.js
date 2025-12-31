import express from 'express';
import cors from 'cors';
import authRoutes from './src/api/routes/v1/authRoutes.js'; 

const app = express();

// IMPORTANTE: CORS debe ir ANTES de cualquier otra cosa
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Maneja las peticiones OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// También usa el middleware de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Rutas
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API de NexusERP funcionando correctamente');
});

// 404
app.use((req, res) => {
    console.log('Ruta no encontrada:', req.method, req.url);
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.url,
        method: req.method
    });
});

export default app;