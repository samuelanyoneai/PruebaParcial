-- ============================================================================
-- BASE DE DATOS: SISTEMA DE TRAZABILIDAD ALIMENTARIA
-- CAPA DE DATOS - PostgreSQL
-- ============================================================================

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE trazabilidad_db;

-- Conectar a la base de datos
-- \c trazabilidad_db

-- ============================================================================
-- TABLA: lotes (Trazabilidad hacia atrás - Origen)
-- ============================================================================
DROP TABLE IF EXISTS logistica CASCADE;
DROP TABLE IF EXISTS procesos CASCADE;
DROP TABLE IF EXISTS lotes CASCADE;

CREATE TABLE lotes (
    id VARCHAR(36) PRIMARY KEY,
    codigo_lote VARCHAR(50) UNIQUE NOT NULL,
    producto VARCHAR(100) NOT NULL,
    finca VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    fecha_cosecha DATE NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    cantidad_kg DECIMAL(10,2) NOT NULL CHECK (cantidad_kg > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar búsquedas
CREATE INDEX idx_lotes_codigo ON lotes(codigo_lote);
CREATE INDEX idx_lotes_fecha ON lotes(fecha_cosecha);

-- ============================================================================
-- TABLA: procesos (Trazabilidad interna - Transformación)
-- ============================================================================
CREATE TABLE procesos (
    id VARCHAR(36) PRIMARY KEY,
    lote_id VARCHAR(36) NOT NULL,
    tipo_proceso VARCHAR(50) NOT NULL 
        CHECK (tipo_proceso IN ('lavado', 'empaquetado', 'control_calidad', 'clasificacion', 'secado')),
    fecha DATE NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    parametros JSONB,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lote_id) REFERENCES lotes(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_procesos_lote ON procesos(lote_id);
CREATE INDEX idx_procesos_fecha ON procesos(fecha);
CREATE INDEX idx_procesos_tipo ON procesos(tipo_proceso);

-- ============================================================================
-- TABLA: logistica (Trazabilidad hacia adelante - Distribución)
-- ============================================================================
CREATE TABLE logistica (
    id VARCHAR(36) PRIMARY KEY,
    lote_id VARCHAR(36) NOT NULL,
    fecha_salida DATE NOT NULL,
    destino VARCHAR(200) NOT NULL,
    transportista VARCHAR(100) NOT NULL,
    temperatura_transporte DECIMAL(5,2) CHECK (temperatura_transporte BETWEEN -20 AND 50),
    fecha_entrega DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lote_id) REFERENCES lotes(id) ON DELETE CASCADE,
    CHECK (fecha_entrega IS NULL OR fecha_entrega >= fecha_salida)
);

-- Índices
CREATE INDEX idx_logistica_lote ON logistica(lote_id);
CREATE INDEX idx_logistica_fecha_salida ON logistica(fecha_salida);
CREATE INDEX idx_logistica_destino ON logistica(destino);

-- ============================================================================
-- COMENTARIOS EN LAS TABLAS
-- ============================================================================
COMMENT ON TABLE lotes IS 'Trazabilidad hacia atrás: Origen de los productos';
COMMENT ON TABLE procesos IS 'Trazabilidad interna: Procesos de transformación';
COMMENT ON TABLE logistica IS 'Trazabilidad hacia adelante: Distribución y logística';

COMMENT ON COLUMN lotes.codigo_lote IS 'Formato: XX-YYYY-NNN';
COMMENT ON COLUMN procesos.parametros IS 'Parámetros adicionales en formato JSON';
COMMENT ON COLUMN logistica.temperatura_transporte IS 'Temperatura en grados Celsius';

-- ============================================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================================================
-- INSERT INTO lotes (id, codigo_lote, producto, finca, ubicacion, fecha_cosecha, responsable, cantidad_kg)
-- VALUES 
--     ('550e8400-e29b-41d4-a716-446655440000', 'MG-2026-001', 'Mangos orgánicos', 'La Esperanza', 'Piura, Perú', '2026-01-06', 'Juan Pérez', 500.00),
--     ('550e8400-e29b-41d4-a716-446655440001', 'AG-2026-001', 'Aguacates Hass', 'Villa Verde', 'Lima, Perú', '2026-01-05', 'María Torres', 300.00);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- SELECT 'Tablas creadas exitosamente' AS mensaje;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

