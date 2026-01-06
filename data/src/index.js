/**
 * CAPA DE DATOS - Servidor de Persistencia
 * Responsabilidad: Exponer servicios de persistencia a la capa de lógica de negocio
 * Puerto: 3001
 * NO contiene: Lógica de negocio, validaciones complejas, UI
 */

const express = require('express');
const cors = require('cors');
const loteRepository = require('./repositories/loteRepository');
const procesoRepository = require('./repositories/procesoRepository');
const logisticaRepository = require('./repositories/logisticaRepository');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ENDPOINTS DE LOTES ====================

app.post('/data/lotes', async (req, res) => {
  try {
    const result = await loteRepository.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/lotes', async (req, res) => {
  try {
    const lotes = await loteRepository.findAll();
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/lotes/:id', async (req, res) => {
  try {
    const lote = await loteRepository.findById(req.params.id);
    if (!lote) {
      return res.status(404).json({ error: 'Lote no encontrado' });
    }
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/lotes/codigo/:codigoLote', async (req, res) => {
  try {
    const lote = await loteRepository.findByCodigoLote(req.params.codigoLote);
    if (!lote) {
      return res.status(404).json({ error: 'Lote no encontrado' });
    }
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENDPOINTS DE PROCESOS ====================

app.post('/data/procesos', async (req, res) => {
  try {
    const result = await procesoRepository.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/procesos', async (req, res) => {
  try {
    const procesos = await procesoRepository.findAll();
    res.json(procesos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/procesos/:id', async (req, res) => {
  try {
    const proceso = await procesoRepository.findById(req.params.id);
    if (!proceso) {
      return res.status(404).json({ error: 'Proceso no encontrado' });
    }
    res.json(proceso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/procesos/lote/:loteId', async (req, res) => {
  try {
    const procesos = await procesoRepository.findByLoteId(req.params.loteId);
    res.json(procesos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENDPOINTS DE LOGÍSTICA ====================

app.post('/data/logistica', async (req, res) => {
  try {
    const result = await logisticaRepository.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/logistica', async (req, res) => {
  try {
    const logistica = await logisticaRepository.findAll();
    res.json(logistica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/logistica/:id', async (req, res) => {
  try {
    const logistica = await logisticaRepository.findById(req.params.id);
    if (!logistica) {
      return res.status(404).json({ error: 'Registro de logística no encontrado' });
    }
    res.json(logistica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/logistica/lote/:loteId', async (req, res) => {
  try {
    const logistica = await logisticaRepository.findByLoteId(req.params.loteId);
    res.json(logistica);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVIDOR ====================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          CAPA DE DATOS - ACTIVA                        ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Puerto: ${PORT}                                          ║`);
  console.log('║  Responsabilidad: Persistencia y recuperación          ║');
  console.log('║  NO contiene: Lógica de negocio                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
});

