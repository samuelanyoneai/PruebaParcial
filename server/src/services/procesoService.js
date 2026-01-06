/**
 * CAPA DE LÓGICA DE NEGOCIO - Servicio de Procesos
 * Responsabilidad: Validaciones y reglas de negocio para procesos
 * NO contiene: Acceso directo a BD, código de UI
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const DATA_LAYER_URL = 'http://localhost:3001';

class ProcesoService {
  /**
   * Validar datos de un proceso (Regla de negocio)
   */
  validarProceso(procesoData) {
    const errores = [];

    // Validación: Lote debe existir
    if (!procesoData.loteId || procesoData.loteId.trim() === '') {
      errores.push('El ID del lote es obligatorio');
    }

    // Validación: Tipo de proceso debe ser válido
    const tiposValidos = ['lavado', 'empaquetado', 'control_calidad', 'clasificacion', 'secado'];
    if (!procesoData.tipoProceso || !tiposValidos.includes(procesoData.tipoProceso)) {
      errores.push(`Tipo de proceso debe ser uno de: ${tiposValidos.join(', ')}`);
    }

    // Validación: Fecha no puede ser futura
    const fechaProceso = new Date(procesoData.fecha);
    const hoy = new Date();
    if (fechaProceso > hoy) {
      errores.push('La fecha del proceso no puede ser en el futuro');
    }

    // Validación: Responsable no puede estar vacío
    if (!procesoData.responsable || procesoData.responsable.trim() === '') {
      errores.push('El responsable es obligatorio');
    }

    return errores;
  }

  /**
   * Validar coherencia temporal (Regla de negocio crítica)
   * El proceso debe ser posterior a la fecha de cosecha del lote
   */
  async validarCoherenciaTemporal(loteId, fechaProceso) {
    const lote = await axios.get(`${DATA_LAYER_URL}/data/lotes/${loteId}`);
    
    if (!lote.data) {
      throw new Error('El lote especificado no existe');
    }

    const fechaCosecha = new Date(lote.data.fechaCosecha);
    const fechaProc = new Date(fechaProceso);

    if (fechaProc < fechaCosecha) {
      throw new Error('La fecha del proceso no puede ser anterior a la fecha de cosecha');
    }

    return true;
  }

  /**
   * Crear un nuevo proceso (Orquestación)
   */
  async crearProceso(procesoData) {
    // 1. Validar reglas de negocio básicas
    const errores = this.validarProceso(procesoData);
    if (errores.length > 0) {
      throw new Error(`Validación fallida: ${errores.join(', ')}`);
    }

    // 2. Validar coherencia temporal
    await this.validarCoherenciaTemporal(procesoData.loteId, procesoData.fecha);

    // 3. Preparar datos (convertir parámetros a JSON)
    const proceso = {
      id: uuidv4(),
      ...procesoData,
      parametros: JSON.stringify(procesoData.parametros || {})
    };

    // 4. Persistir en capa de datos
    const response = await axios.post(`${DATA_LAYER_URL}/data/procesos`, proceso);
    
    return response.data;
  }

  /**
   * Obtener todos los procesos
   */
  async obtenerTodosProcesos() {
    const response = await axios.get(`${DATA_LAYER_URL}/data/procesos`);
    return response.data;
  }

  /**
   * Obtener procesos de un lote específico
   */
  async obtenerProcesosPorLote(loteId) {
    const response = await axios.get(`${DATA_LAYER_URL}/data/procesos/lote/${loteId}`);
    return response.data;
  }
}

module.exports = new ProcesoService();

