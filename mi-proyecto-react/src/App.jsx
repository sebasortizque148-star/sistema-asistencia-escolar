import { useState, useEffect } from 'react';
import axios from 'axios';

// Imágenes para el menú
const IMAGENES = {
  inicio: "https://cdn-icons-png.flaticon.com/512/3242/3242257.png",
  alumnos: "https://cdn-icons-png.flaticon.com/512/201/201614.png",
  registros: "https://cdn-icons-png.flaticon.com/512/2838/2838885.png"
};

function App() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevoEstatus, setNuevoEstatus] = useState('Asistió');
  const [formulario, setFormulario] = useState({ alumno_id: '', fecha: '', hora: '' });

  // Conexión al backend
  const API = 'http://localhost:3001/api';

  // Cargar datos al abrir la app
  const cargarAlumnos = async () => {
    try {
      const res = await axios.get(`${API}/alumnos`);
      setAlumnos(res.data);
    } catch (err) {
      console.error('Error al cargar alumnos:', err);
    }
  };

  const cargarAsistencias = async () => {
    try {
      const res = await axios.get(`${API}/asistencias`);
      setAsistencias(res.data);
    } catch (err) {
      console.error('Error al cargar registros:', err);
    }
  };

  useEffect(() => {
    cargarAlumnos();
    cargarAsistencias();
  }, []);

  // Guardar nueva asistencia
  const registrarAsistencia = async (e) => {
    e.preventDefault();
    if (!formulario.alumno_id) return alert('Selecciona un alumno');

    try {
      await axios.post(`${API}/asistencia`, {
        ...formulario,
        estatus: 'Asistió'
      });
      alert('✅ Asistencia registrada correctamente');
      setFormulario({ alumno_id: '', fecha: '', hora: '' });
      cargarAsistencias();
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // Editar asistencia
  const guardarEdicion = async (id) => {
    try {
      await axios.put(`${API}/asistencia/${id}`, { estatus: nuevoEstatus });
      setEditando(null);
      cargarAsistencias();
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  // Eliminar asistencia
  const eliminarAsistencia = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      await axios.delete(`${API}/asistencia/${id}`);
      cargarAsistencias();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div style={estiloContenedorGeneral}>
      {/* Encabezado */}
      <header style={estiloEncabezado}>
        <h1 style={estiloTitulo}>📚 Sistema de Gestión de Asistencia Escolar</h1>
        <p style={estiloSubtitulo}>Registro y control de asistencia de alumnos</p>
      </header>

      {/* Menú de navegación */}
      <nav style={estiloMenu}>
        <button
          onClick={() => setSeccionActiva('inicio')}
          style={{ ...estiloBotonMenu, ...(seccionActiva === 'inicio' ? estiloActivo : {}) }}
        >
          <img src={IMAGENES.inicio} alt="Inicio" style={estiloIcono} />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setSeccionActiva('registrar')}
          style={{ ...estiloBotonMenu, ...(seccionActiva === 'registrar' ? estiloActivo : {}) }}
        >
          <img src={IMAGENES.alumnos} alt="Registrar" style={estiloIcono} />
          <span>Registrar Asistencia</span>
        </button>

        <button
          onClick={() => setSeccionActiva('registros')}
          style={{ ...estiloBotonMenu, ...(seccionActiva === 'registros' ? estiloActivo : {}) }}
        >
          <img src={IMAGENES.registros} alt="Ver Registros" style={estiloIcono} />
          <span>Ver Asistencias</span>
        </button>
      </nav>

      {/* Contenido principal */}
      <main style={estiloContenido}>
        {/* Sección Inicio */}
        {seccionActiva === 'inicio' && (
          <div style={estiloTarjeta}>
            <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>¿Qué hace esta aplicación?</h2>
            <p style={estiloTexto}>
              Esta aplicación permite gestionar de forma automatizada la asistencia escolar. Facilita el registro de alumnos, y toda la información recopilada se envía y almacena de manera centralizada en una base de datos MySQL, facilitando el seguimiento y control de asistencia para cualquier grupo.
            </p>

            <h3 style={{ color: '#2980b9', marginTop: '25px' }}>¿Cómo funciona?</h3>
            <ul style={estiloLista}>
              <li><strong>Registro rápido:</strong> Selecciona el alumno y confirma su asistencia en segundos.</li>
              <li><strong>Procesamiento de datos:</strong> Guarda automáticamente la fecha, hora y estatus.</li>
              <li><strong>Almacenamiento seguro:</strong> La información se guarda en la base de datos, permitiendo tener reportes actualizados, ordenados y siempre disponibles para su consulta.</li>
            </ul>
          </div>
        )}

        {/* Sección Registrar Asistencia */}
        {seccionActiva === 'registrar' && (
          <div style={estiloTarjeta}>
            <h2 style={{ color: '#27ae60', textAlign: 'center' }}>📝 Registrar Nueva Asistencia</h2>
            <form onSubmit={registrarAsistencia} style={estiloFormulario}>
              <div style={estiloCampo}>
                <label>Alumno:</label>
                <select
                  value={formulario.alumno_id}
                  onChange={(e) => setFormulario({ ...formulario, alumno_id: e.target.value })}
                  required
                  style={estiloInput}
                >
                  <option value="">-- Selecciona un alumno --</option>
                  {alumnos.map(alumno => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre} | {alumno.numero_control} | {alumno.grupo}
                    </option>
                  ))}
                </select>
              </div>

              <div style={estiloCampo}>
                <label>Fecha:</label>
                <input
                  type="date"
                  value={formulario.fecha}
                  onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                  required
                  style={estiloInput}
                />
              </div>

              <div style={estiloCampo}>
                <label>Hora:</label>
                <input
                  type="time"
                  value={formulario.hora}
                  onChange={(e) => setFormulario({ ...formulario, hora: e.target.value })}
                  required
                  style={estiloInput}
                />
              </div>

              <button type="submit" style={estiloBotonPrincipal}>✅ Guardar Asistencia</button>
            </form>
          </div>
        )}

        {/* Sección Ver Registros */}
        {seccionActiva === 'registros' && (
          <div style={estiloTarjeta}>
            <h2 style={{ color: '#8e44ad', textAlign: 'center' }}>📋 Registro de Asistencias</h2>

            <div style={estiloTablaContenedor}>
              <table style={estiloTabla}>
                <thead>
                  <tr style={estiloEncabezadoTabla}>
                    <th>Nombre</th>
                    <th>Control</th>
                    <th>Grupo</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estatus</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={estiloSinDatos}>No hay registros de asistencia por el momento</td>
                    </tr>
                  ) : (
                    asistencias.map(registro => (
                      <tr key={registro.id} style={estiloFila}>
                        <td>{registro.nombre}</td>
                        <td>{registro.numero_control}</td>
                        <td>{registro.grupo}</td>
                        <td>{registro.fecha}</td>
                        <td>{registro.hora}</td>
                        <td>
                          {editando === registro.id ? (
                            <select
                              value={nuevoEstatus}
                              onChange={(e) => setNuevoEstatus(e.target.value)}
                              style={estiloSelect}
                            >
                              <option>Asistió</option>
                              <option>Falta</option>
                              <option>Retardo</option>
                            </select>
                          ) : (
                            <span style={estiloEstatus(registro.estatus)}>{registro.estatus}</span>
                          )}
                        </td>
                        <td>
                          {editando === registro.id ? (
                            <>
                              <button onClick={() => guardarEdicion(registro.id)} style={estiloBtnAccion('#27ae60')}>💾 Guardar</button>
                              <button onClick={() => setEditando(null)} style={estiloBtnAccion('#95a5a6')}>❌ Cancelar</button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditando(registro.id); setNuevoEstatus(registro.estatus); }}
                                style={estiloBtnAccion('#f39c12')}
                              >
                                ✏️ Editar
                              </button>
                              <button onClick={() => eliminarAsistencia(registro.id)} style={estiloBtnAccion('#e74c3c')}>🗑️ Borrar</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// -------------------- ESTILOS --------------------
const estiloContenedorGeneral = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Roboto, sans-serif",
  backgroundColor: '#f8fafc',
  minHeight: '100vh'
};

const estiloEncabezado = {
  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
  color: 'white',
  padding: '25px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  marginBottom: '25px'
};

const estiloTitulo = { margin: '0 0 10px 0', fontSize: '28px' };
const estiloSubtitulo = { margin: 0, opacity: 0.9 };

const estiloMenu = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: '30px'
};

const estiloBotonMenu = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '15px 20px',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '500',
  minWidth: '130px',
  transition: 'all 0.2s ease'
};

const estiloActivo = {
  backgroundColor: '#3b82f6',
  color: 'white',
  boxShadow: '0 3px 10px rgba(59, 130, 246, 0.3)'
};

const estiloIcono = { width: '40px', height: '40px' };

const estiloContenido = { width: '100%' };

const estiloTarjeta = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 3px 12px rgba(0,0,0,0.12)'
};

const estiloTexto = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#334155',
  textAlign: 'justify'
};

const estiloLista = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#334155'
};

const estiloFormulario = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  maxWidth: '500px',
  margin: '0 auto'
};

const estiloCampo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left'
};

const estiloInput = {
  padding: '10px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '15px'
};

const estiloBotonPrincipal = {
  marginTop: '10px',
  padding: '12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#16a34a',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: '500'
};

const estiloTablaContenedor = { overflowX: 'auto' };
const estiloTabla = { width: '100%', borderCollapse: 'collapse', marginTop: '15px' };
const estiloEncabezadoTabla = {
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  color: 'white'
};
const estiloFila = { borderBottom: '1px solid #e2e8f0' };
const estiloSinDatos = { padding: '30px', textAlign: 'center', color: '#64748b' };

const estiloSelect = {
  padding: '5px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px'
};

const estiloEstatus = (estado) => {
  let color = '#64748b';
  if (estado === 'Asistió') color = '#16a34a';
  if (estado === 'Falta') color = '#dc2626';
  if (estado === 'Retardo') color = '#f59e0b';
  return { fontWeight: 'bold', color };
};

const estiloBtnAccion = (color) => ({
  padding: '6px 10px',
  margin: '0 4px',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
  background: color
});

export default App;