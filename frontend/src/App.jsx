import { useState, useEffect } from 'react';
import axios from 'axios';

// Imágenes e iconos
const IMAGENES = {
  inicio: "https://cdn-icons-png.flaticon.com/512/3242/3242257.png",
  registrar: "https://cdn-icons-png.flaticon.com/512/201/201614.png",
  ver: "https://cdn-icons-png.flaticon.com/512/2838/2838885.png",
  queHace: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  comoFunciona: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  caracteristicas: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  ventajas: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
};

function App() {
  // Función para obtener la fecha de hoy en formato correcto
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [alumnoNombre, setAlumnoNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [fecha, setFecha] = useState(obtenerFechaHoy());
  const [estatus, setEstatus] = useState('Asistió');
  const [asistencias, setAsistencias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoEstatus, setNuevoEstatus] = useState('Asistió');
  const [busqueda, setBusqueda] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');

  const [recuadrosAbiertos, setRecuadrosAbiertos] = useState({
    queHace: false,
    comoFunciona: false,
    caracteristicas: false,
    ventajas: false
  });

  const alternarRecuadro = (nombre) => {
    setRecuadrosAbiertos(prev => ({
      ...prev,
      [nombre]: !prev[nombre]
    }));
  };

  const API = 'http://localhost:3001/api';

  const cargarAsistencias = async () => {
    try {
      const res = await axios.get(`${API}/asistencias`);
      setAsistencias(res.data);
    } catch (err) {
      console.error('Error al cargar:', err);
    }
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const guardarAsistencia = async (e) => {
    e.preventDefault();
    if (!alumnoNombre.trim() || !grado.trim() || !fecha) {
      return alert('⚠️ Completa todos los campos: Alumno, Grado y Fecha');
    }
    try {
      await axios.post(`${API}/asistencia`, {
        nombre: alumnoNombre.trim(),
        grado: grado.trim(),
        fecha: fecha,
        estatus: estatus
      });
      alert('✅ Asistencia guardada correctamente');
      setAlumnoNombre('');
      setGrado('');
      setFecha(obtenerFechaHoy());
      setEstatus('Asistió');
      cargarAsistencias();
    } catch (err) {
      console.error('Error:', err);
      alert(`❌ No se pudo guardar: ${err.response?.data?.error || err.message}`);
    }
  };

  const actualizarEstatus = async (id) => {
    try {
      await axios.put(`${API}/asistencia/${id}`, { estatus: nuevoEstatus });
      setEditandoId(null);
      cargarAsistencias();
    } catch (err) {
      alert('❌ Error al actualizar');
    }
  };

  const borrarRegistro = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este registro?')) return;
    try {
      await axios.delete(`${API}/asistencia/${id}`);
      cargarAsistencias();
    } catch (err) {
      alert('❌ Error al eliminar');
    }
  };

  const seleccionarOpcion = (opcion) => {
    setSeccionActiva(opcion);
    setMenuAbierto(false);
  };

  const asistenciasFiltradas = asistencias.filter(reg => {
    const coincideBusqueda = reg.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideGrado = filtroGrado === '' || reg.grado === filtroGrado;
    return coincideBusqueda && coincideGrado;
  });

  const gradosUnicos = [...new Set(asistencias.map(reg => reg.grado))].sort();

  return (
    <div style={estiloContenedorGeneral}>
      <header style={estiloEncabezado}>
        <h1 style={estiloTitulo}>📚 Sistema de Gestión de Asistencia Escolar</h1>
        <p style={estiloSubtitulo}>Registro, consulta y control de asistencia de alumnos</p>
      </header>

      <div style={estiloContenedorMenu}>
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)} 
          style={estiloBotonMenuPrincipal}
        >
          📋 Menú Principal ▾
        </button>

        {menuAbierto && (
          <div style={estiloOpcionesMenu}>
            <button 
              onClick={() => seleccionarOpcion('inicio')} 
              style={{...estiloOpcionMenu, ...(seccionActiva === 'inicio' ? estiloOpcionActiva : {})}}
            >
              <img src={IMAGENES.inicio} alt="Inicio" style={estiloIconoMenu} />
              Inicio
            </button>
            <button 
              onClick={() => seleccionarOpcion('registrar')} 
              style={{...estiloOpcionMenu, ...(seccionActiva === 'registrar' ? estiloOpcionActiva : {})}}
            >
              <img src={IMAGENES.registrar} alt="Registrar" style={estiloIconoMenu} />
              Registrar Asistencia
            </button>
            <button 
              onClick={() => seleccionarOpcion('ver')} 
              style={{...estiloOpcionMenu, ...(seccionActiva === 'ver' ? estiloOpcionActiva : {})}}
            >
              <img src={IMAGENES.ver} alt="Ver" style={estiloIconoMenu} />
              Ver Asistencias
            </button>
          </div>
        )}
      </div>

      <main style={estiloContenido}>
        {seccionActiva === 'inicio' && (
          <div style={estiloGridRecuadros}>
            <div style={estiloRecuadro}>
              <div style={estiloEncabezadoRecuadro} onClick={() => alternarRecuadro('queHace')}>
                <h2 style={estiloTituloRecuadro}>¿Qué hace?</h2>
                <span style={estiloFlecha}>{recuadrosAbiertos.queHace ? '▲' : '▼'}</span>
              </div>
              {recuadrosAbiertos.queHace && (
                <div style={estiloContenidoRecuadro}>
                  <img src={IMAGENES.queHace} alt="¿Qué hace?" style={estiloImagenRecuadro} />
                  <p style={estiloTextoRecuadro}>
                    Esta aplicación permite gestionar de forma automatizada la asistencia escolar. Facilita el registro de alumnos, almacenando la información de forma organizada para llevar un seguimiento claro y ordenado.
                  </p>
                </div>
              )}
            </div>

            <div style={estiloRecuadro}>
              <div style={estiloEncabezadoRecuadro} onClick={() => alternarRecuadro('comoFunciona')}>
                <h2 style={estiloTituloRecuadro}>¿Cómo funciona?</h2>
                <span style={estiloFlecha}>{recuadrosAbiertos.comoFunciona ? '▲' : '▼'}</span>
              </div>
              {recuadrosAbiertos.comoFunciona && (
                <div style={estiloContenidoRecuadro}>
                  <img src={IMAGENES.comoFunciona} alt="¿Cómo funciona?" style={estiloImagenRecuadro} />
                  <ul style={estiloListaRecuadro}>
                    <li>Ingresa los datos del alumno</li>
                    <li>Guarda la información en la base de datos</li>
                    <li>Consulta, edita o elimina registros cuando lo necesites</li>
                  </ul>
                </div>
              )}
            </div>

            <div style={estiloRecuadro}>
              <div style={estiloEncabezadoRecuadro} onClick={() => alternarRecuadro('caracteristicas')}>
                <h2 style={estiloTituloRecuadro}>Características principales</h2>
                <span style={estiloFlecha}>{recuadrosAbiertos.caracteristicas ? '▲' : '▼'}</span>
              </div>
              {recuadrosAbiertos.caracteristicas && (
                <div style={estiloContenidoRecuadro}>
                  <img src={IMAGENES.caracteristicas} alt="Características" style={estiloImagenRecuadro} />
                  <ul style={estiloListaRecuadro}>
                    <li>Registro rápido y seguro</li>
                    <li>Clasificación de asistencia con horarios de referencia</li>
                    <li>Búsqueda y filtros avanzados</li>
                    <li>Interfaz amigable y moderna</li>
                  </ul>
                </div>
              )}
            </div>

            <div style={estiloRecuadro}>
              <div style={estiloEncabezadoRecuadro} onClick={() => alternarRecuadro('ventajas')}>
                <h2 style={estiloTituloRecuadro}>Ventajas del sistema</h2>
                <span style={estiloFlecha}>{recuadrosAbiertos.ventajas ? '▲' : '▼'}</span>
              </div>
              {recuadrosAbiertos.ventajas && (
                <div style={estiloContenidoRecuadro}>
                  <img src={IMAGENES.ventajas} alt="Ventajas" style={estiloImagenRecuadro} />
                  <ul style={estiloListaRecuadro}>
                    <li>Reduce errores manuales</li>
                    <li>Acceso rápido a la información</li>
                    <li>Control detallado por grado y horario</li>
                    <li>Diseño adaptable a cualquier dispositivo</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {seccionActiva === 'registrar' && (
          <div style={estiloTarjetaPrincipal}>
            <div style={estiloEncabezadoSeccionConImagen}>
              <img src={IMAGENES.registrar} alt="Registrar" style={estiloImagenEncabezado} />
              <div>
                <h2 style={estiloTituloSeccion}>📝 Registrar Nueva Asistencia</h2>
                <p style={estiloSubtituloSeccion}>Completa los datos para guardar el registro</p>
              </div>
            </div>

            <form onSubmit={guardarAsistencia} style={estiloFormularioMejorado}>
              <div style={estiloFilaCampos}>
                <div style={estiloCampoAmplio}>
                  <label style={estiloEtiquetaMejorada}>👤 Nombre completo del alumno</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez López"
                    value={alumnoNombre}
                    onChange={(e) => setAlumnoNombre(e.target.value)}
                    required
                    style={estiloInputMejorado}
                  />
                </div>
              </div>

              <div style={estiloFilaCampos}>
                <div style={estiloCampoMediano}>
                  <label style={estiloEtiquetaMejorada}>🏫 Grado y Grupo</label>
                  <input
                    type="text"
                    placeholder="Ej: 1° A, 2° B"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    required
                    style={estiloInputMejorado}
                  />
                </div>
                <div style={estiloCampoMediano}>
                  <label style={estiloEtiquetaMejorada}>📅 Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    style={estiloInputMejorado}
                  />
                </div>
              </div>

              <div style={estiloRecuadroEstatusMejorado}>
                <h3 style={estiloTituloEstatus}>📋 Tipo de asistencia</h3>
                <div style={estiloOpcionesEstatus}>
                  <label style={estiloOpcionRadio}>
                    <input type="radio" name="estatus" value="Asistió" checked={estatus === 'Asistió'} onChange={(e) => setEstatus(e.target.value)} />
                    <span style={{color: '#16a34a', fontWeight: 500}}>✅ Asistió - Llegada hasta las 7:50 am</span>
                  </label>
                  <label style={estiloOpcionRadio}>
                    <input type="radio" name="estatus" value="Retraso" checked={estatus === 'Retraso'} onChange={(e) => setEstatus(e.target.value)} />
                    <span style={{color: '#f59e0b', fontWeight: 500}}>⏱️ Retraso - Llegada hasta las 8:40 am</span>
                  </label>
                  <label style={estiloOpcionRadio}>
                    <input type="radio" name="estatus" value="Falta" checked={estatus === 'Falta'} onChange={(e) => setEstatus(e.target.value)} />
                    <span style={{color: '#dc2626', fontWeight: 500}}>❌ Falta - Llegada después de las 8:40 am</span>
                  </label>
                  <label style={estiloOpcionRadio}>
                    <input type="radio" name="estatus" value="Falta justificada" checked={estatus === 'Falta justificada'} onChange={(e) => setEstatus(e.target.value)} />
                    <span style={{color: '#2563eb', fontWeight: 500}}>📄 Falta justificada</span>
                  </label>
                </div>
              </div>

              <div style={estiloContenedorBoton}>
                <button type="submit" style={estiloBotonGuardarMejorado}>💾 Guardar Registro</button>
              </div>
            </form>
          </div>
        )}

        {seccionActiva === 'ver' && (
          <div style={estiloTarjetaPrincipal}>
            <div style={estiloEncabezadoSeccionConImagen}>
              <img src={IMAGENES.ver} alt="Ver registros" style={estiloImagenEncabezado} />
              <div>
                <h2 style={estiloTituloSeccion}>📋 Registro de Asistencias</h2>
                <p style={estiloSubtituloSeccion}>Consulta, busca y gestiona todos los registros</p>
              </div>
            </div>

            <div style={estiloBarraFiltros}>
              <div style={estiloCampoBusqueda}>
                <label style={estiloEtiquetaFiltro}>🔍 Buscar por nombre:</label>
                <input
                  type="text"
                  placeholder="Escribe el nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={estiloInputBusqueda}
                />
              </div>
              <div style={estiloCampoFiltro}>
                <label style={estiloEtiquetaFiltro}>🏫 Filtrar por grado:</label>
                <select value={filtroGrado} onChange={(e) => setFiltroGrado(e.target.value)} style={estiloSelectFiltro}>
                  <option value="">Todos los grados</option>
                  {gradosUnicos.map(gr => <option key={gr} value={gr}>{gr}</option>)}
                </select>
              </div>
            </div>

            <div style={estiloTablaContenedorMejorado}>
              <table style={estiloTablaMejorada}>
                <thead>
                  <tr style={estiloEncabezadoTablaMejorado}>
                    <th style={estiloThTabla}>Nombre</th>
                    <th style={estiloThTabla}>Grado</th>
                    <th style={estiloThTabla}>Fecha</th>
                    <th style={estiloThTabla}>Estatus</th>
                    <th style={estiloThTabla}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {asistenciasFiltradas.length === 0 ? (
                    <tr><td colSpan={5} style={estiloSinDatos}>No hay registros para mostrar</td></tr>
                  ) : (
                    asistenciasFiltradas.map(reg => (
                      <tr key={reg.id} style={estiloFilaMejorada}>
                        <td style={estiloCeldaNombre}>{reg.nombre}</td>
                        <td style={estiloCeldaGrado}>{reg.grado}</td>
                        <td style={estiloCeldaFecha}>{reg.fecha}</td>
                        <td>
                          {editandoId === reg.id ? (
                            <select value={nuevoEstatus} onChange={(e) => setNuevoEstatus(e.target.value)} style={estiloSelectEditar}>
                              <option value="Asistió">✅ Asistió - Hasta 7:50 am</option>
                              <option value="Retraso">⏱️ Retraso - Hasta 8:40 am</option>
                              <option value="Falta">❌ Falta - Después de 8:40 am</option>
                              <option value="Falta justificada">📄 Falta justificada</option>
                            </select>
                          ) : (
                            <span style={estiloEstatusMejorado(reg.estatus)}>
                              {reg.estatus === 'Asistió' ? '✅ Asistió (hasta 7:50 am)' :
                               reg.estatus === 'Retraso' ? '⏱️ Retraso (hasta 8:40 am)' :
                               reg.estatus === 'Falta' ? '❌ Falta (después de 8:40 am)' :
                               reg.estatus === 'Falta justificada' ? '📄 Falta justificada' : reg.estatus}
                            </span>
                          )}
                        </td>
                        <td style={estiloCeldaAcciones}>
                          {editandoId === reg.id ? (
                            <>
                              <button onClick={() => actualizarEstatus(reg.id)} style={estiloBtnGuardar}>💾 Guardar</button>
                              <button onClick={() => setEditandoId(null)} style={estiloBtnCancelar}>❌ Cancelar</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditandoId(reg.id); setNuevoEstatus(reg.estatus); }} style={estiloBtnEditar}>✏️ Editar</button>
                              <button onClick={() => borrarRegistro(reg.id)} style={estiloBtnEliminar}>🗑️ Borrar</button>
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

// ---------------- ESTILOS ACTUALIZADOS ----------------
const estiloContenedorGeneral = {
  maxWidth: '1250px',
  margin: '0 auto',
  padding: '25px',
  fontFamily: "'Segoe UI', Roboto, 'Open Sans', sans-serif",
  background: '#2a2a2e',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  color: '#f0f0f0',
  fontSize: '15px'
};

const estiloEncabezado = {
  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
  color: 'white',
  padding: '30px 25px',
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  marginBottom: '35px'
};

const estiloTitulo = {
  margin: '0 0 10px 0',
  fontSize: '28px',
  fontWeight: 700
};

const estiloSubtitulo = {
  margin: 0,
  opacity: 0.95,
  fontSize: '16px'
};

const estiloContenedorMenu = {
  position: 'relative',
  maxWidth: '260px',
  margin: '0 auto 35px auto',
  zIndex: 10
};

const estiloBotonMenuPrincipal = {
  width: '100%',
  padding: '14px 20px',
  fontSize: '17px',
  fontWeight: 600,
  border: 'none',
  borderRadius: '12px',
  background: '#1e40af',
  color: 'white',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(0,0,0,0.25)'
};

const estiloOpcionesMenu = {
  position: 'absolute',
  top: '115%',
  left: 0,
  right: 0,
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
};

const estiloOpcionMenu = {
  width: '100%',
  padding: '14px 18px',
  border: 'none',
  backgroundColor: 'white',
  textAlign: 'left',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const estiloOpcionActiva = {
  backgroundColor: '#dbeafe',
  color: '#1e40af',
  fontWeight: 600
};

const estiloIconoMenu = {
  width: '24px',
  height: '24px'
};

const estiloContenido = {
  width: '100%'
};

const estiloGridRecuadros = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
  gap: '20px'
};

const estiloRecuadro = {
  backgroundColor: '#38383e',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  overflow: 'hidden',
  border: '1px solid #4a4a52'
};

const estiloEncabezadoRecuadro = {
  padding: '15px 20px',
  backgroundColor: '#44444c',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const estiloTituloRecuadro = {
  color: '#e0e7ff',
  fontSize: '19px',
  margin: 0,
  fontWeight: 600
};

const estiloFlecha = {
  fontSize: '18px',
  color: '#a5b4fc',
  fontWeight: 'bold'
};

const estiloContenidoRecuadro = {
  padding: '20px',
  borderTop: '1px solid #4a4a52'
};

const estiloImagenRecuadro = {
  width: '100%',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '14px'
};

const estiloTextoRecuadro = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: '#e2e8f0',
  margin: 0
};

const estiloListaRecuadro = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#e2e8f0',
  paddingLeft: '22px',
  margin: 0
};

const estiloTarjetaPrincipal = {
  backgroundColor: '#38383e',
  padding: '30px',
  borderRadius: '16px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
  border: '1px solid #4a4a52'
};

const estiloEncabezadoSeccionConImagen = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  borderBottom: '1px solid #4a4a52',
  paddingBottom: '20px',
  marginBottom: '25px',
  flexWrap: 'wrap'
};

const estiloImagenEncabezado = {
  width: '75px',
  height: '75px',
  objectFit: 'cover',
  borderRadius: '50%',
  boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
};

const estiloTituloSeccion = {
  color: '#e0e7ff',
  fontSize: '24px',
  margin: '0 0 6px 0',
  fontWeight: 700
};

const estiloSubtituloSeccion = {
  color: '#b4b4c0',
  fontSize: '16px',
  margin: 0
};

const estiloFormularioMejorado = {
  display: 'flex',
  flexDirection: 'column',
  gap: '22px'
};

const estiloFilaCampos = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap'
};

const estiloCampoAmplio = {
  flex: 1,
  minWidth: '300px'
};

const estiloCampoMediano = {
  flex: 1,
  minWidth: '230px'
};

const estiloEtiquetaMejorada = {
  display: 'block',
  fontSize: '15px',
  fontWeight: 600,
  color: '#e2e8f0',
  marginBottom: '6px'
};

const estiloInputMejorado = {
  width: '100%',
  padding: '12px 15px',
  border: '2px solid #55555e',
  borderRadius: '8px',
  fontSize: '15px',
  backgroundColor: '#44444c',
  color: '#f0f0f0',
  outline: 'none'
};

const estiloRecuadroEstatusMejorado = {
  backgroundColor: '#44444c',
  padding: '20px',
  borderRadius: '10px',
  border: '1px solid #55555e'
};

const estiloTituloEstatus = {
  margin: '0 0 12px 0',
  fontSize: '18px',
  color: '#bfdbfe',
  fontWeight: 600
};

const estiloOpcionesEstatus = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap'
};

const estiloOpcionRadio = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 500
};

const estiloContenedorBoton = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '8px'
};

const estiloBotonGuardarMejorado = {
  padding: '14px 35px',
  border: 'none',
  borderRadius: '8px',
  background: '#16a34a',
  color: 'white',
  fontSize: '17px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
};

const estiloBarraFiltros = {
  display: 'flex',
  gap: '20px',
  marginBottom: '22px',
  flexWrap: 'wrap',
  padding: '16px',
  backgroundColor: '#44444c',
  borderRadius: '10px',
  border: '1px solid #55555e'
};

const estiloCampoBusqueda = {
  flex: 2,
  minWidth: '280px'
};

const estiloCampoFiltro = {
  flex: 1,
  minWidth: '200px'
};

const estiloEtiquetaFiltro = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: '#e2e8f0',
  marginBottom: '6px'
};

const estiloInputBusqueda = {
  width: '100%',
  padding: '11px 14px',
  border: '2px solid #55555e',
  borderRadius: '8px',
  fontSize: '15px',
  backgroundColor: '#38383e',
  color: '#f0f0f0'
};

const estiloSelectFiltro = {
  width: '100%',
  padding: '11px 14px',
  border: '2px solid #55555e',
  borderRadius: '8px',
  fontSize: '15px',
  backgroundColor: '#38383e',
  color: '#f0f0f0'
};

const estiloTablaContenedorMejorado = {
  overflowX: 'auto',
  borderRadius: '10px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
};

const estiloTablaMejorada = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '15px'
};

const estiloEncabezadoTablaMejorado = {
  background: '#1e40af',
  color: 'white',
  textAlign: 'left'
};

const estiloThTabla = {
  padding: '14px 12px',
  fontWeight: 700
};

const estiloFilaMejorada = {
  borderBottom: '1px solid #4a4a52'
};

const estiloCeldaNombre = {
  padding: '12px',
  fontWeight: 600,
  color: '#e2e8f0'
};

const estiloCeldaGrado = {
  padding: '12px',
  color: '#d1d5db'
};

const estiloCeldaFecha = {
  padding: '12px',
  color: '#d1d5db'
};

const estiloCeldaAcciones = {
  padding: '12px'
};

const estiloSinDatos = {
  padding: '35px',
  textAlign: 'center',
  color: '#a8a8b3',
  fontSize: '16px'
};

const estiloSelectEditar = {
  padding: '7px 10px',
  border: '2px solid #55555e',
  borderRadius: '6px',
  fontSize: '14px',
  backgroundColor: '#44444c',
  color: '#f0f0f0'
};

const estiloEstatusMejorado = (estado) => {
  const estilos = {
    'Asistió': { backgroundColor: '#166534', color: '#bbf7d0', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 },
    'Retraso': { backgroundColor: '#854d0e', color: '#fde68a', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 },
    'Falta': { backgroundColor: '#991b1b', color: '#fecaca', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 },
    'Falta justificada': { backgroundColor: '#1e40af', color: '#bfdbfe', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }
  };
  return estilos[estado] || { padding: '6px 12px' };
};

const estiloBtnGuardar = {
  padding: '7px 12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#16a34a',
  color: 'white',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  margin: '2px'
};

const estiloBtnCancelar = {
  padding: '7px 12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#6b7280',
  color: 'white',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  margin: '2px'
};

const estiloBtnEditar = {
  padding: '7px 12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#f59e0b',
  color: 'white',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  margin: '2px'
};

const estiloBtnEliminar = {
  padding: '7px 12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#dc2626',
  color: 'white',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  margin: '2px'
};

export default App;