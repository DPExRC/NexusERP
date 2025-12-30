import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Verificamos si tenemos la URL completa (Nube) o datos separados (Local)
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // El SSL es obligatorio para conectar desde afuera a bases de datos en la nube
  ssl: connectionString ? { rejectUnauthorized: false } : false, 
  
  // Si no hay connectionString, usará tus variables individuales (opcional)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;