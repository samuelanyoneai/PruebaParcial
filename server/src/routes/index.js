/**
 * CAPA DE LÓGICA DE NEGOCIO - Rutas principales
 * Responsabilidad: Definir endpoints de la API REST
 */

const express = require('express');
const router = express.Router();

const loteService = require('../services/loteService');
const procesoService = require('../services/procesoService');
const logisticaService = require('../services/logisticaService');
const trazabilidadService = require('../services/trazabilidadService');

// ==================== LOTES (Trazabilidad hacia atrás) ====================

router.post('/lotes', async (req, res) => {
  try {
    const result = await loteService.crearLote(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Lote creado exitosamente',
      data: result 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/lotes', async (req, res) => {
  try {
    const lotes = await loteService.obtenerTodosLosLotes();
    res.json({ 
      success: true, 
      data: lotes 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/lotes/:id', async (req, res) => {
  try {
    const lote = await loteService.obtenerLotePorId(req.params.id);
    res.json({ 
      success: true, 
      data: lote 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== PROCESOS (Trazabilidad interna) ====================

router.post('/procesos', async (req, res) => {
  try {
    const result = await procesoService.crearProceso(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Proceso registrado exitosamente',
      data: result 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/procesos', async (req, res) => {
  try {
    const procesos = await procesoService.obtenerTodosProcesos();
    res.json({ 
      success: true, 
      data: procesos 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/procesos/lote/:loteId', async (req, res) => {
  try {
    const procesos = await procesoService.obtenerProcesosPorLote(req.params.loteId);
    res.json({ 
      success: true, 
      data: procesos 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== LOGÍSTICA (Trazabilidad hacia adelante) ====================

router.post('/logistica', async (req, res) => {
  try {
    const result = await logisticaService.crearLogistica(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Logística registrada exitosamente',
      data: result 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/logistica', async (req, res) => {
  try {
    const logistica = await logisticaService.obtenerTodaLogistica();
    res.json({ 
      success: true, 
      data: logistica 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/logistica/lote/:loteId', async (req, res) => {
  try {
    const logistica = await logisticaService.obtenerLogisticaPorLote(req.params.loteId);
    res.json({ 
      success: true, 
      data: logistica 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== TRAZABILIDAD COMPLETA ====================

router.get('/trazabilidad/:loteId', async (req, res) => {
  try {
    const trazabilidad = await trazabilidadService.obtenerTrazabilidadCompleta(req.params.loteId);
    res.json({ 
      success: true, 
      data: trazabilidad 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/trazabilidad/codigo/:codigoLote', async (req, res) => {
  try {
    const trazabilidad = await trazabilidadService.obtenerTrazabilidadPorCodigo(req.params.codigoLote);
    res.json({ 
      success: true, 
      data: trazabilidad 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

