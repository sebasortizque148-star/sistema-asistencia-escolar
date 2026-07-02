// Usamos import en lugar de require (para que funcione con "type": "module")
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json()); // Para leer datos en formato JSON

// Conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',          // Usuario por defecto en XAMPP
  password: '',          // Si no tienes contraseña déjalo vacío
  database: 'asistencia_escolar' // Nombre de tu base de datos
});

// Probar conexión
async function probarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL correctamente');
    connection.release();
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
  }
}
probarConexion();

// Ruta para GUARDAR asistencia
app.post('/api/asistencia', async (req, res) => {
  try {
    const { nombre, grado, fecha, estatus } = req.body;

    if (!nombre || !grado || !fecha || !estatus) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const [resultado] = await pool.query(
      `INSERT INTO asistencias (nombre, grado, fecha, estatus)
       VALUES (?, ?, ?, ?)`,
      [nombre, grado, fecha, estatus]
    );

    res.json({ mensaje: '✅ Asistencia guardada', id: resultado.insertId });
  } catch (err) {
    console.error('❌ Error al guardar:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para OBTENER todas las asistencias
app.get('/api/asistencias', async (req, res) => {
  try {
    const [registros] = await pool.query('SELECT * FROM asistencias ORDER BY fecha DESC');
    res.json(registros);
  } catch (err) {
    console.error('❌ Error al cargar:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para ACTUALIZAR estatus
app.put('/api/asistencia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus } = req.body;
    await pool.query('UPDATE asistencias SET estatus = ? WHERE id = ?', [estatus, id]);
    res.json({ mensaje: '✅ Actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para ELIMINAR registro
app.delete('/api/asistencia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM asistencias WHERE id = ?', [id]);
    res.json({ mensaje: '✅ Registro eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 