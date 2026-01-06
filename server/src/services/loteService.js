/**
 * CAPA DE LÓGICA DE NEGOCIO - Servicio de Lotes
 * Responsabilidad: Validaciones y reglas de negocio para lotes
 * NO contiene: Acceso directo a BD, código de UI
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const DATA_LAYER_URL = 'http://localhost:3001';

class LoteService {
  /**
   * Validar datos de un lote (Regla de negocio)
   */
  validarLote(loteData) {
    const errores = [];

    // Validación: Código de lote debe seguir formato específico
    if (!loteData.codigoLote || !/^[A-Z]{2}-\d{4}-\d{3}$/.test(loteData.codigoLote)) {
      errores.push('Código de lote debe seguir el formato XX-YYYY-NNN (ej: MG-2026-001)');
    }

    // Validación: Producto no puede estar vacío
    if (!loteData.producto || loteData.producto.trim() === '') {
      errores.push('El producto es obligatorio');
    }

    // Validación: Finca no puede estar vacía
    if (!loteData.finca || loteData.finca.trim() === '') {
      errores.push('La finca es obligatoria');
    }

    // Validación: Ubicación no puede estar vacía
    if (!loteData.ubicacion || loteData.ubicacion.trim() === '') {
      errores.push('La ubicación es obligatoria');
    }

    // Validación: Fecha de cosecha no puede ser futura
    const fechaCosecha = new Date(loteData.fechaCosecha);
    const hoy = new Date();
    if (fechaCosecha > hoy) {
      errores.push('La fecha de cosecha no puede ser en el futuro');
    }

    // Validación: Responsable no puede estar vacío
    if (!loteData.responsable || loteData.responsable.trim() === '') {
      errores.push('El responsable es obligatorio');
    }

    // Validación: Cantidad debe ser mayor a 0
    if (!loteData.cantidadKg || loteData.cantidadKg <= 0) {
      errores.push('La cantidad debe ser mayor a 0 kg');
    }

    return errores;
  }

  /**
   * Crear un nuevo lote (Orquestación)
   */
  async crearLote(loteData) {
    // 1. Validar reglas de negocio
    const errores = this.validarLote(loteData);
    if (errores.length > 0) {
      throw new Error(`Validación fallida: ${errores.join(', ')}`);
    }

    // 2. Verificar que no exista un lote con el mismo código
    try {
      const response = await axios.get(`${DATA_LAYER_URL}/data/lotes/codigo/${loteData.codigoLote}`);
      if (response.data) {
        throw new Error('Ya existe un lote con ese código');
      }
    } catch (error) {
      // Si es 404, está bien (no existe), continuar
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }

    // 3. Generar ID único
    const lote = {
      id: uuidv4(),
      ...loteData
    };

    // 4. Persistir en capa de datos
    const response = await axios.post(`${DATA_LAYER_URL}/data/lotes`, lote);
    
    return response.data;
  }

  /**
   * Obtener todos los lotes
   */
  async obtenerTodosLosLotes() {
    const response = await axios.get(`${DATA_LAYER_URL}/data/lotes`);
    return response.data;
  }

  /**
   * Obtener un lote por ID
   */
  async obtenerLotePorId(id) {
    const response = await axios.get(`${DATA_LAYER_URL}/data/lotes/${id}`);
    return response.data;
  }

  /**
   * Obtener un lote por código
   */
  async obtenerLotePorCodigo(codigoLote) {
    const response = await axios.get(`${DATA_LAYER_URL}/data/lotes/codigo/${codigoLote}`);
    return response.data;
  }
}

module.exports = new LoteService();

