/**
 * CAPA DE PRESENTACIÓN - Lógica de Interfaz
 * Responsabilidad: Interacción con el usuario, comunicación con API
 * NO contiene: Lógica de negocio, acceso directo a base de datos
 */

// Configuración de la API (Capa de Lógica de Negocio)
const API_URL = 'http://localhost:3000/api';

// ==================== UTILIDADES ====================

function mostrarMensaje(mensaje, tipo = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensaje;
    messageDiv.className = `message ${tipo}`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ==================== NAVEGACIÓN ====================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remover active de todos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Activar el seleccionado
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
        
        // Cargar datos según la pestaña
        if (tabId === 'lotes-tab') {
            cargarLotes();
        } else if (tabId === 'procesos-tab') {
            cargarLotesEnSelect('loteIdProceso');
            cargarProcesos();
        } else if (tabId === 'logistica-tab') {
            cargarLotesEnSelect('loteIdLogistica');
            cargarLogistica();
        } else if (tabId === 'trazabilidad-tab') {
            cargarLotesEnSelect('loteIdTrazabilidad');
        }
    });
});

// ==================== COMPONENTE 1: LOTES ====================

// Cargar lista de lotes
async function cargarLotes() {
    try {
        const response = await fetch(`${API_URL}/lotes`);
        const data = await response.json();
        
        const container = document.getElementById('lista-lotes');
        
        if (!data.success || data.data.length === 0) {
            container.innerHTML = '<p class="loading">No hay lotes registrados</p>';
            return;
        }
        
        container.innerHTML = data.data.map(lote => `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">${lote.codigoLote}</span>
                    <span class="card-badge">${lote.producto}</span>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Finca</span>
                        <span class="card-value">${lote.finca}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Ubicación</span>
                        <span class="card-value">${lote.ubicacion}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Fecha Cosecha</span>
                        <span class="card-value">${formatearFecha(lote.fechaCosecha)}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Responsable</span>
                        <span class="card-value">${lote.responsable}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Cantidad</span>
                        <span class="card-value">${lote.cantidadKg} kg</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('lista-lotes').innerHTML = 
            '<p class="loading">Error al cargar lotes</p>';
    }
}

// Registrar nuevo lote
document.getElementById('form-lote').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loteData = {
        codigoLote: document.getElementById('codigoLote').value,
        producto: document.getElementById('producto').value,
        finca: document.getElementById('finca').value,
        ubicacion: document.getElementById('ubicacion').value,
        fechaCosecha: document.getElementById('fechaCosecha').value,
        responsable: document.getElementById('responsable').value,
        cantidadKg: parseFloat(document.getElementById('cantidadKg').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/lotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loteData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('✅ Lote registrado exitosamente', 'success');
            document.getElementById('form-lote').reset();
            cargarLotes();
        } else {
            mostrarMensaje('❌ ' + data.error, 'error');
        }
    } catch (error) {
        mostrarMensaje('❌ Error al registrar lote', 'error');
    }
});

// ==================== COMPONENTE 2: PROCESOS ====================

// Cargar procesos
async function cargarProcesos() {
    try {
        const response = await fetch(`${API_URL}/procesos`);
        const data = await response.json();
        
        const container = document.getElementById('lista-procesos');
        
        if (!data.success || data.data.length === 0) {
            container.innerHTML = '<p class="loading">No hay procesos registrados</p>';
            return;
        }
        
        container.innerHTML = data.data.map(proceso => `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">${proceso.tipoProceso.toUpperCase()}</span>
                    <span class="card-badge">${formatearFecha(proceso.fecha)}</span>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Responsable</span>
                        <span class="card-value">${proceso.responsable}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Observaciones</span>
                        <span class="card-value">${proceso.observaciones || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('lista-procesos').innerHTML = 
            '<p class="loading">Error al cargar procesos</p>';
    }
}

// Registrar proceso
document.getElementById('form-proceso').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const procesoData = {
        loteId: document.getElementById('loteIdProceso').value,
        tipoProceso: document.getElementById('tipoProceso').value,
        fecha: document.getElementById('fechaProceso').value,
        responsable: document.getElementById('responsableProceso').value,
        observaciones: document.getElementById('observaciones').value,
        parametros: {}
    };
    
    try {
        const response = await fetch(`${API_URL}/procesos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(procesoData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('✅ Proceso registrado exitosamente', 'success');
            document.getElementById('form-proceso').reset();
            cargarProcesos();
        } else {
            mostrarMensaje('❌ ' + data.error, 'error');
        }
    } catch (error) {
        mostrarMensaje('❌ Error al registrar proceso', 'error');
    }
});

// ==================== COMPONENTE 3: LOGÍSTICA ====================

// Cargar registros de logística
async function cargarLogistica() {
    try {
        const response = await fetch(`${API_URL}/logistica`);
        const data = await response.json();
        
        const container = document.getElementById('lista-logistica');
        
        if (!data.success || data.data.length === 0) {
            container.innerHTML = '<p class="loading">No hay registros de logística</p>';
            return;
        }
        
        container.innerHTML = data.data.map(log => `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">${log.destino}</span>
                    <span class="card-badge">${log.transportista}</span>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Fecha Salida</span>
                        <span class="card-value">${formatearFecha(log.fechaSalida)}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Temperatura</span>
                        <span class="card-value">${log.temperaturaTransporte ? log.temperaturaTransporte + '°C' : 'N/A'}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Fecha Entrega</span>
                        <span class="card-value">${log.fechaEntrega ? formatearFecha(log.fechaEntrega) : 'Pendiente'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        document.getElementById('lista-logistica').innerHTML = 
            '<p class="loading">Error al cargar registros</p>';
    }
}

// Registrar logística
document.getElementById('form-logistica').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const logisticaData = {
        loteId: document.getElementById('loteIdLogistica').value,
        fechaSalida: document.getElementById('fechaSalida').value,
        destino: document.getElementById('destino').value,
        transportista: document.getElementById('transportista').value,
        temperaturaTransporte: document.getElementById('temperaturaTransporte').value ? 
            parseFloat(document.getElementById('temperaturaTransporte').value) : null,
        fechaEntrega: document.getElementById('fechaEntrega').value || null
    };
    
    try {
        const response = await fetch(`${API_URL}/logistica`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logisticaData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Logística registrada exitosamente', 'success');
            document.getElementById('form-logistica').reset();
            cargarLogistica();
        } else {
            mostrarMensaje('❌ ' + data.error, 'error');
        }
    } catch (error) {
        mostrarMensaje('❌ Error al registrar logística', 'error');
    }
});

// ==================== COMPONENTE 4: TRAZABILIDAD COMPLETA ====================

document.getElementById('btn-consultar-trazabilidad').addEventListener('click', async () => {
    const loteId = document.getElementById('loteIdTrazabilidad').value;
    
    if (!loteId) {
        mostrarMensaje('❌ Seleccione un lote', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/trazabilidad/${loteId}`);
        const data = await response.json();
        
        if (!data.success) {
            mostrarMensaje('❌ ' + data.error, 'error');
            return;
        }
        
        const traza = data.data;
        const container = document.getElementById('resultado-trazabilidad');
        
        container.innerHTML = `
            <h2>Trazabilidad Completa: ${traza.codigoLote}</h2>
            
            <div class="trazabilidad-container">
                <!-- Estado -->
                <div class="trazabilidad-card">
                    <div class="trazabilidad-header">
                        <div>
                            <div class="trazabilidad-title">Estado de Trazabilidad</div>
                            <div class="trazabilidad-subtitle">${traza.estadoTrazabilidad.mensaje}</div>
                        </div>
                    </div>
                    <span class="estado-badge estado-${traza.estadoTrazabilidad.estado.toLowerCase()}">
                        ${traza.estadoTrazabilidad.estado} - ${traza.estadoTrazabilidad.porcentaje}%
                    </span>
                </div>
                
                <!-- Trazabilidad hacia atrás -->
                <div class="trazabilidad-card">
                    <div class="trazabilidad-header">
                        <div>
                            <div class="trazabilidad-title">Trazabilidad Hacia Atrás (Origen)</div>
                            <div class="trazabilidad-subtitle">De dónde viene el producto</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="card-field">
                            <span class="card-label">Producto</span>
                            <span class="card-value">${traza.trazabilidadHaciaAtras.producto}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Finca</span>
                            <span class="card-value">${traza.trazabilidadHaciaAtras.finca}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Ubicación</span>
                            <span class="card-value">${traza.trazabilidadHaciaAtras.ubicacion}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Fecha Cosecha</span>
                            <span class="card-value">${formatearFecha(traza.trazabilidadHaciaAtras.fechaCosecha)}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Responsable</span>
                            <span class="card-value">${traza.trazabilidadHaciaAtras.responsable}</span>
                        </div>
                        <div class="card-field">
                            <span class="card-label">Cantidad</span>
                            <span class="card-value">${traza.trazabilidadHaciaAtras.cantidadKg} kg</span>
                        </div>
                    </div>
                </div>
                
                <!-- Trazabilidad interna -->
                <div class="trazabilidad-card">
                    <div class="trazabilidad-header">
                        <div>
                            <div class="trazabilidad-title">Trazabilidad Interna (Transformación)</div>
                            <div class="trazabilidad-subtitle">Procesos aplicados - ${traza.trazabilidadInterna.totalProcesos} proceso(s)</div>
                        </div>
                    </div>
                    ${traza.trazabilidadInterna.procesos.length > 0 ? 
                        traza.trazabilidadInterna.procesos.map((p, i) => `
                            <div class="card-body" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                                <div style="font-weight: 600; margin-bottom: 10px;">Proceso ${i + 1}: ${p.tipoProceso.toUpperCase()}</div>
                                <div class="card-field">
                                    <span class="card-label">Fecha</span>
                                    <span class="card-value">${formatearFecha(p.fecha)}</span>
                                </div>
                                <div class="card-field">
                                    <span class="card-label">Responsable</span>
                                    <span class="card-value">${p.responsable}</span>
                                </div>
                                <div class="card-field">
                                    <span class="card-label">Observaciones</span>
                                    <span class="card-value">${p.observaciones || 'N/A'}</span>
                                </div>
                            </div>
                        `).join('')
                        : '<p style="padding: 15px; color: #6c757d;">No hay procesos registrados</p>'
                    }
                </div>
                
                <!-- Trazabilidad hacia adelante -->
                <div class="trazabilidad-card">
                    <div class="trazabilidad-header">
                        <div>
                            <div class="trazabilidad-title">Trazabilidad Hacia Adelante (Distribución)</div>
                            <div class="trazabilidad-subtitle">A dónde fue - ${traza.trazabilidadHaciaAdelante.totalEnvios} envío(s)</div>
                        </div>
                    </div>
                    ${traza.trazabilidadHaciaAdelante.envios.length > 0 ? 
                        traza.trazabilidadHaciaAdelante.envios.map((e, i) => `
                            <div class="card-body" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                                <div style="font-weight: 600; margin-bottom: 10px;">Envío ${i + 1}: ${e.destino}</div>
                                <div class="card-field">
                                    <span class="card-label">Fecha Salida</span>
                                    <span class="card-value">${formatearFecha(e.fechaSalida)}</span>
                                </div>
                                <div class="card-field">
                                    <span class="card-label">Transportista</span>
                                    <span class="card-value">${e.transportista}</span>
                                </div>
                                <div class="card-field">
                                    <span class="card-label">Temperatura</span>
                                    <span class="card-value">${e.temperaturaTransporte ? e.temperaturaTransporte + '°C' : 'N/A'}</span>
                                </div>
                                <div class="card-field">
                                    <span class="card-label">Fecha Entrega</span>
                                    <span class="card-value">${e.fechaEntrega ? formatearFecha(e.fechaEntrega) : 'Pendiente'}</span>
                                </div>
                            </div>
                        `).join('')
                        : '<p style="padding: 15px; color: #6c757d;">No hay envíos registrados</p>'
                    }
                </div>
            </div>
        `;
        
        container.classList.remove('hidden');
        
    } catch (error) {
        mostrarMensaje('Error al consultar trazabilidad', 'error');
    }
});

// ==================== UTILIDADES PARA SELECTS ====================

async function cargarLotesEnSelect(selectId) {
    try {
        const response = await fetch(`${API_URL}/lotes`);
        const data = await response.json();
        
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Seleccione un lote --</option>';
        
        if (data.success && data.data.length > 0) {
            data.data.forEach(lote => {
                const option = document.createElement('option');
                option.value = lote.id;
                option.textContent = `${lote.codigoLote} - ${lote.producto}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar lotes en select:', error);
    }
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaCosecha').value = hoy;
    document.getElementById('fechaProceso').value = hoy;
    document.getElementById('fechaSalida').value = hoy;
    
    // Cargar lotes inicialmente
    cargarLotes();
});

