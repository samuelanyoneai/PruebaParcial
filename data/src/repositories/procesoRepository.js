/**
 * CAPA DE DATOS - Repositorio de Procesos (PostgreSQL)
 * Responsabilidad: Operaciones CRUD sobre la tabla de procesos
 * NO contiene: Lógica de negocio, validaciones complejas
 */

const pool = require('../database');

class ProcesoRepository {
  /**
   * Crear un nuevo proceso
   */
  async create(proceso) {
    const sql = `
      INSERT INTO procesos (id, lote_id, tipo_proceso, fecha, responsable, parametros, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const values = [
      proceso.id, 
      proceso.loteId, 
      proceso.tipoProceso, 
      proceso.fecha, 
      proceso.responsable, 
      proceso.parametros, // PostgreSQL maneja JSONB nativamente
      proceso.observaciones
    ];
    
    const result = await pool.query(sql, values);
    return { id: result.rows[0].id, changes: result.rowCount };
  }

  /**
   * Obtener todos los procesos
   */
  async findAll() {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        tipo_proceso as "tipoProceso", 
        fecha, 
        responsable, 
        parametros, 
        observaciones,
        created_at as "createdAt"
      FROM procesos 
      ORDER BY fecha DESC
    `;
    
    const result = await pool.query(sql);
    return result.rows;
  }

  /**
   * Obtener un proceso por ID
   */
  async findById(id) {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        tipo_proceso as "tipoProceso", 
        fecha, 
        responsable, 
        parametros, 
        observaciones,
        created_at as "createdAt"
      FROM procesos 
      WHERE id = $1
    `;
    
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  }

  /**
   * Obtener todos los procesos de un lote específico
   */
  async findByLoteId(loteId) {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        tipo_proceso as "tipoProceso", 
        fecha, 
        responsable, 
        parametros, 
        observaciones,
        created_at as "createdAt"
      FROM procesos 
      WHERE lote_id = $1 
      ORDER BY fecha ASC
    `;
    
    const result = await pool.query(sql, [loteId]);
    return result.rows;
  }

  /**
   * Eliminar un proceso
   */
  async delete(id) {
    const sql = 'DELETE FROM procesos WHERE id = $1';
    const result = await pool.query(sql, [id]);
    return { changes: result.rowCount };
  }
}

module.exports = new ProcesoRepository();

