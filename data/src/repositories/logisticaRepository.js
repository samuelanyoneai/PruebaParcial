/**
 * CAPA DE DATOS - Repositorio de Logística (PostgreSQL)
 * Responsabilidad: Operaciones CRUD sobre la tabla de logística
 * NO contiene: Lógica de negocio, validaciones complejas
 */

const pool = require('../database');

class LogisticaRepository {
  /**
   * Crear un nuevo registro de logística
   */
  async create(logistica) {
    const sql = `
      INSERT INTO logistica (id, lote_id, fecha_salida, destino, transportista, temperatura_transporte, fecha_entrega)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const values = [
      logistica.id, 
      logistica.loteId, 
      logistica.fechaSalida, 
      logistica.destino, 
      logistica.transportista, 
      logistica.temperaturaTransporte, 
      logistica.fechaEntrega
    ];
    
    const result = await pool.query(sql, values);
    return { id: result.rows[0].id, changes: result.rowCount };
  }

  /**
   * Obtener todos los registros de logística
   */
  async findAll() {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        fecha_salida as "fechaSalida", 
        destino, 
        transportista, 
        temperatura_transporte as "temperaturaTransporte", 
        fecha_entrega as "fechaEntrega",
        created_at as "createdAt"
      FROM logistica 
      ORDER BY fecha_salida DESC
    `;
    
    const result = await pool.query(sql);
    return result.rows;
  }

  /**
   * Obtener un registro de logística por ID
   */
  async findById(id) {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        fecha_salida as "fechaSalida", 
        destino, 
        transportista, 
        temperatura_transporte as "temperaturaTransporte", 
        fecha_entrega as "fechaEntrega",
        created_at as "createdAt"
      FROM logistica 
      WHERE id = $1
    `;
    
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  }

  /**
   * Obtener todos los registros de logística de un lote específico
   */
  async findByLoteId(loteId) {
    const sql = `
      SELECT 
        id, 
        lote_id as "loteId", 
        fecha_salida as "fechaSalida", 
        destino, 
        transportista, 
        temperatura_transporte as "temperaturaTransporte", 
        fecha_entrega as "fechaEntrega",
        created_at as "createdAt"
      FROM logistica 
      WHERE lote_id = $1 
      ORDER BY fecha_salida ASC
    `;
    
    const result = await pool.query(sql, [loteId]);
    return result.rows;
  }

  /**
   * Actualizar registro de logística (ej: actualizar fecha de entrega)
   */
  async update(id, logistica) {
    const sql = `
      UPDATE logistica 
      SET destino = $1, transportista = $2, temperatura_transporte = $3, fecha_entrega = $4
      WHERE id = $5
    `;
    
    const values = [
      logistica.destino, 
      logistica.transportista, 
      logistica.temperaturaTransporte, 
      logistica.fechaEntrega, 
      id
    ];
    
    const result = await pool.query(sql, values);
    return { changes: result.rowCount };
  }

  /**
   * Eliminar un registro de logística
   */
  async delete(id) {
    const sql = 'DELETE FROM logistica WHERE id = $1';
    const result = await pool.query(sql, [id]);
    return { changes: result.rowCount };
  }
}

module.exports = new LogisticaRepository();

