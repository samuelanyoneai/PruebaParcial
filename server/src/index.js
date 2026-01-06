/**
 * CAPA DE LÓGICA DE NEGOCIO - Servidor Principal
 * Responsabilidad: Validación, orquestación, reglas de negocio
 * Puerto: 3000
 * NO contiene: Código de UI, acceso directo a base de datos
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    servicio: 'Sistema de Trazabilidad Alimentaria',
    capa: 'Lógica de Negocio',
    version: '1.0.0',
    endpoints: {
      lotes: '/api/lotes',
      procesos: '/api/procesos',
      logistica: '/api/logistica',
      trazabilidad: '/api/trazabilidad/:loteId'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       CAPA DE LÓGICA DE NEGOCIO - ACTIVA               ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Puerto: ${PORT}                                          ║`);
  console.log('║  Responsabilidad: Validación y orquestación            ║');
  console.log('║  NO contiene: UI ni acceso directo a BD                ║');
  console.log('║                                                        ║');
  console.log('║  API REST disponible en: http://localhost:3000/api    ║');
  console.log('╚════════════════════════════════════════════════════════╝');
});

