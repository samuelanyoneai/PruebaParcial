/**
 * CAPA DE LÓGICA DE NEGOCIO - Servicio de Logística
 * Responsabilidad: Validaciones y reglas de negocio para logística
 * NO contiene: Acceso directo a BD, código de UI
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const DATA_LAYER_URL = 'http://localhost:3001';

class LogisticaService {
  /**
   * Validar datos de logística (Regla de negocio)
   */
  validarLogistica(logisticaData) {
    const errores = [];

    // Validación: Lote debe existir
    if (!logisticaData.loteId || logisticaData.loteId.trim() === '') {
      errores.push('El ID del lote es obligatorio');
    }

    // Validación: Fecha de salida no puede ser futura
    const fechaSalida = new Date(logisticaData.fechaSalida);
    const hoy = new Date();
    if (fechaSalida > hoy) {
      errores.push('La fecha de salida no puede ser en el futuro');
    }

    // Validación: Destino no puede estar vacío
    if (!logisticaData.destino || logisticaData.destino.trim() === '') {
      errores.push('El destino es obligatorio');
    }

    // Validación: Transportista no puede estar vacío
    if (!logisticaData.transportista || logisticaData.transportista.trim() === '') {
      errores.push('El transportista es obligatorio');
    }

    // Validación: Temperatura debe estar en rango razonable (para productos refrigerados)
    if (logisticaData.temperaturaTransporte !== undefined && logisticaData.temperaturaTransporte !== null) {
      const temp = logisticaData.temperaturaTransporte;
      if (temp < -20 || temp > 50) {
        errores.push('La temperatura de transporte debe estar entre -20°C y 50°C');
      }
    }

    // Validación: Si hay fecha de entrega, debe ser posterior a fecha de salida
    if (logisticaData.fechaEntrega) {
      const fechaEntrega = new Date(logisticaData.fechaEntrega);
      if (fechaEntrega < fechaSalida) {
        errores.push('La fecha de entrega no puede ser anterior a la fecha de salida');
      }
    }

    return errores;
  }

  /**
   * Validar que el lote tenga procesos completados (Regla de negocio crítica)
   * No se puede enviar un lote sin procesos
   */
  async validarLoteProcesado(loteId) {
    const procesos = await axios.get(`${DATA_LAYER_URL}/data/procesos/lote/${loteId}`);
    
    if (!procesos.data || procesos.data.length === 0) {
      throw new Error('No se puede registrar logística para un lote sin procesos de transformación');
    }

    return true;
  }

  /**
   * Validar coherencia temporal con cosecha y procesos
   */
  async validarCoherenciaTemporal(loteId, fechaSalida) {
    // Obtener lote
    const lote = await axios.get(`${DATA_LAYER_URL}/data/lotes/${loteId}`);
    if (!lote.data) {
      throw new Error('El lote especificado no existe');
    }

    const fechaCosecha = new Date(lote.data.fechaCosecha);
    const fechaSal = new Date(fechaSalida);

    if (fechaSal < fechaCosecha) {
      throw new Error('La fecha de salida no puede ser anterior a la fecha de cosecha');
    }

    // Obtener procesos del lote
    const procesos = await axios.get(`${DATA_LAYER_URL}/data/procesos/lote/${loteId}`);
    if (procesos.data && procesos.data.length > 0) {
      // Obtener la fecha del último proceso
      const ultimoProceso = procesos.data[procesos.data.length - 1];
      const fechaUltimoProceso = new Date(ultimoProceso.fecha);

      if (fechaSal < fechaUltimoProceso) {
        throw new Error('La fecha de salida no puede ser anterior al último proceso');
      }
    }

    return true;
  }

  /**
   * Crear un nuevo registro de logística (Orquestación)
   */
  async crearLogistica(logisticaData) {
    // 1. Validar reglas de negocio básicas
    const errores = this.validarLogistica(logisticaData);
    if (errores.length > 0) {
      throw new Error(`Validación fallida: ${errores.join(', ')}`);
    }

    // 2. Validar que el lote tenga procesos
    await this.validarLoteProcesado(logisticaData.loteId);

    // 3. Validar coherencia temporal
    await this.validarCoherenciaTemporal(logisticaData.loteId, logisticaData.fechaSalida);

    // 4. Preparar datos
    const logistica = {
      id: uuidv4(),
      ...logisticaData
    };

    // 5. Persistir en capa de datos
    const response = await axios.post(`${DATA_LAYER_URL}/data/logistica`, logistica);
    
    return response.data;
  }

  /**
   * Obtener todos los registros de logística
   */
  async obtenerTodaLogistica() {
    const response = await axios.get(`${DATA_LAYER_URL}/data/logistica`);
    return response.data;
  }

  /**
   * Obtener logística de un lote específico
   */
  async obtenerLogisticaPorLote(loteId) {
    const response = await axios.get(`${DATA_LAYER_URL}/data/logistica/lote/${loteId}`);
    return response.data;
  }
}

module.exports = new LogisticaService();

