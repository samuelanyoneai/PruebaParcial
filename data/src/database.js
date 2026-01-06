/**
 * CAPA DE DATOS - Configuración de Base de Datos PostgreSQL
 * Responsabilidad: Conexión y configuración de la base de datos
 * NO contiene: Lógica de negocio
 */

require('dotenv').config();
const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'trazabilidad_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

// Función para verificar y crear tablas si no existen
async function initializeDatabase() {
  try {
    // Verificar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Base de datos PostgreSQL lista');
    
    // Verificar si las tablas existen
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('lotes', 'procesos', 'logistica')
    `);
    
    if (result.rows.length === 3) {
      console.log('✅ Tablas encontradas: lotes, procesos, logistica');
    } else {
      console.log('⚠️  Algunas tablas no existen. Por favor ejecuta el script init.sql');
      console.log('   Comando: psql -U postgres -d trazabilidad_db -f database/init.sql');
    }
    
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error.message);
    console.log('\n⚠️  ASEGÚRATE DE:');
    console.log('   1. PostgreSQL está corriendo');
    console.log('   2. La base de datos "trazabilidad_db" existe');
    console.log('   3. Las credenciales en .env son correctas');
    console.log('   4. Has ejecutado el script init.sql\n');
  }
}

initializeDatabase();

module.exports = pool;

