import express from 'express';
import cors from 'cors';

const app = express();

// Configuración de CORS mejorada
app.use(cors({
    origin: '*', // En producción puedes cambiar '*' por 'https://nexus-erp-coral.vercel.app'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de NexusERP funcionando correctamente');
});



export default app;