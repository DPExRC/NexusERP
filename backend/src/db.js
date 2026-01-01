import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Verificamos si tenemos la URL completa (Nube) o datos separados (Local)
const connectionString = process.env.DATABASE_URL;

console.log('🔧 Configurando conexión a base de datos...');
console.log('DATABASE_URL presente:', !!connectionString);

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : false, 
  
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Eventos de conexión
pool.on('connect', (client) => {
  console.log('✅ Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

// Test inicial de conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error en test de conexión:', err);
  } else {
    console.log('✅ Base de datos conectada exitosamente:', res.rows[0]);
  }
});

export default pool;