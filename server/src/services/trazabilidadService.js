/**
 * CAPA DE LÓGICA DE NEGOCIO - Servicio de Trazabilidad Completa
 * Responsabilidad: Orquestar la trazabilidad completa (hacia atrás, interna, hacia adelante)
 * NO contiene: Acceso directo a BD, código de UI
 */

const axios = require('axios');

const DATA_LAYER_URL = 'http://localhost:3001';

class TrazabilidadService {
  /**
   * Obtener la trazabilidad completa de un lote
   * Integra: Origen + Transformación + Distribución
   */
  async obtenerTrazabilidadCompleta(loteId) {
    try {
      // 1. Obtener información del lote (Trazabilidad hacia atrás)
      const loteResponse = await axios.get(`${DATA_LAYER_URL}/data/lotes/${loteId}`);
      const lote = loteResponse.data;

      if (!lote) {
        throw new Error('Lote no encontrado');
      }

      // 2. Obtener procesos del lote (Trazabilidad interna)
      const procesosResponse = await axios.get(`${DATA_LAYER_URL}/data/procesos/lote/${loteId}`);
      const procesos = procesosResponse.data;

      // 3. Obtener logística del lote (Trazabilidad hacia adelante)
      const logisticaResponse = await axios.get(`${DATA_LAYER_URL}/data/logistica/lote/${loteId}`);
      const logistica = logisticaResponse.data;

      // 4. Componer respuesta completa (Orquestación)
      return {
        loteId: lote.id,
        codigoLote: lote.codigoLote,
        trazabilidadHaciaAtras: {
          tipo: 'ORIGEN',
          producto: lote.producto,
          finca: lote.finca,
          ubicacion: lote.ubicacion,
          fechaCosecha: lote.fechaCosecha,
          responsable: lote.responsable,
          cantidadKg: lote.cantidadKg
        },
        trazabilidadInterna: {
          tipo: 'TRANSFORMACIÓN',
          totalProcesos: procesos.length,
          procesos: procesos.map(p => ({
            id: p.id,
            tipoProceso: p.tipoProceso,
            fecha: p.fecha,
            responsable: p.responsable,
            parametros: p.parametros,
            observaciones: p.observaciones
          }))
        },
        trazabilidadHaciaAdelante: {
          tipo: 'DISTRIBUCIÓN',
          totalEnvios: logistica.length,
          envios: logistica.map(l => ({
            id: l.id,
            fechaSalida: l.fechaSalida,
            destino: l.destino,
            transportista: l.transportista,
            temperaturaTransporte: l.temperaturaTransporte,
            fechaEntrega: l.fechaEntrega
          }))
        },
        estadoTrazabilidad: this.calcularEstadoTrazabilidad(lote, procesos, logistica)
      };
    } catch (error) {
      throw new Error(`Error al obtener trazabilidad: ${error.message}`);
    }
  }

  /**
   * Calcular el estado de completitud de la trazabilidad
   */
  calcularEstadoTrazabilidad(lote, procesos, logistica) {
    const tieneOrigen = !!lote;
    const tieneProcesos = procesos && procesos.length > 0;
    const tieneLogistica = logistica && logistica.length > 0;

    let estado = 'INCOMPLETO';
    let porcentaje = 0;

    if (tieneOrigen) porcentaje += 33;
    if (tieneProcesos) porcentaje += 33;
    if (tieneLogistica) porcentaje += 34;

    if (porcentaje === 100) {
      estado = 'COMPLETO';
    } else if (porcentaje >= 66) {
      estado = 'PARCIAL';
    }

    return {
      estado,
      porcentaje,
      tieneOrigen,
      tieneProcesos,
      tieneLogistica,
      mensaje: this.generarMensajeEstado(tieneOrigen, tieneProcesos, tieneLogistica)
    };
  }

  /**
   * Generar mensaje descriptivo del estado
   */
  generarMensajeEstado(tieneOrigen, tieneProcesos, tieneLogistica) {
    if (tieneOrigen && tieneProcesos && tieneLogistica) {
      return 'Trazabilidad completa registrada';
    } else if (tieneOrigen && tieneProcesos) {
      return 'Falta registrar distribución';
    } else if (tieneOrigen) {
      return 'Falta registrar transformación y distribución';
    }
    return 'Lote registrado, sin procesos ni distribución';
  }

  /**
   * Buscar trazabilidad por código de lote
   */
  async obtenerTrazabilidadPorCodigo(codigoLote) {
    try {
      const loteResponse = await axios.get(`${DATA_LAYER_URL}/data/lotes/codigo/${codigoLote}`);
      const lote = loteResponse.data;

      if (!lote) {
        throw new Error('Lote no encontrado');
      }

      return await this.obtenerTrazabilidadCompleta(lote.id);
    } catch (error) {
      throw new Error(`Error al obtener trazabilidad: ${error.message}`);
    }
  }
}

module.exports = new TrazabilidadService();

