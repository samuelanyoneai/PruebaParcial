/**
 * CAPA DE DATOS - Repositorio de Lotes (PostgreSQL)
 * Responsabilidad: Operaciones CRUD sobre la tabla de lotes
 * NO contiene: Lógica de negocio, validaciones complejas
 */

const pool = require('../database');

class LoteRepository {
  /**
   * Crear un nuevo lote
   */
  async create(lote) {
    const sql = `
      INSERT INTO lotes (id, codigo_lote, producto, finca, ubicacion, fecha_cosecha, responsable, cantidad_kg)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const values = [
      lote.id, 
      lote.codigoLote, 
      lote.producto, 
      lote.finca, 
      lote.ubicacion, 
      lote.fechaCosecha, 
      lote.responsable, 
      lote.cantidadKg
    ];
    
    const result = await pool.query(sql, values);
    return { id: result.rows[0].id, changes: result.rowCount };
  }

  /**
   * Obtener todos los lotes
   */
  async findAll() {
    const sql = `
      SELECT 
        id, 
        codigo_lote as "codigoLote", 
        producto, 
        finca, 
        ubicacion, 
        fecha_cosecha as "fechaCosecha", 
        responsable, 
        cantidad_kg as "cantidadKg",
        created_at as "createdAt"
      FROM lotes 
      ORDER BY fecha_cosecha DESC
    `;
    
    const result = await pool.query(sql);
    return result.rows;
  }

  /**
   * Obtener un lote por ID
   */
  async findById(id) {
    const sql = `
      SELECT 
        id, 
        codigo_lote as "codigoLote", 
        producto, 
        finca, 
        ubicacion, 
        fecha_cosecha as "fechaCosecha", 
        responsable, 
        cantidad_kg as "cantidadKg",
        created_at as "createdAt"
      FROM lotes 
      WHERE id = $1
    `;
    
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  }

  /**
   * Obtener un lote por código de lote
   */
  async findByCodigoLote(codigoLote) {
    const sql = `
      SELECT 
        id, 
        codigo_lote as "codigoLote", 
        producto, 
        finca, 
        ubicacion, 
        fecha_cosecha as "fechaCosecha", 
        responsable, 
        cantidad_kg as "cantidadKg",
        created_at as "createdAt"
      FROM lotes 
      WHERE codigo_lote = $1
    `;
    
    const result = await pool.query(sql, [codigoLote]);
    return result.rows[0];
  }

  /**
   * Actualizar un lote
   */
  async update(id, lote) {
    const sql = `
      UPDATE lotes 
      SET producto = $1, finca = $2, ubicacion = $3, fecha_cosecha = $4, 
          responsable = $5, cantidad_kg = $6
      WHERE id = $7
    `;
    
    const values = [
      lote.producto, 
      lote.finca, 
      lote.ubicacion, 
      lote.fechaCosecha, 
      lote.responsable, 
      lote.cantidadKg, 
      id
    ];
    
    const result = await pool.query(sql, values);
    return { changes: result.rowCount };
  }

  /**
   * Eliminar un lote
   */
  async delete(id) {
    const sql = 'DELETE FROM lotes WHERE id = $1';
    const result = await pool.query(sql, [id]);
    return { changes: result.rowCount };
  }
}

module.exports = new LoteRepository();

