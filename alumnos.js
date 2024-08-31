// alumnos.js
// index.js
const express = require('express');
const app = express();
const alumnosRouter = require('./alumnos');

app.use(express.json());
app.use('/api', alumnosRouter);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const db = require('./database');

// Crear un nuevo alumno
router.post('/alumnos', (req, res) => {
    const { nombre, edad, curso } = req.body;
    db.run(`INSERT INTO alumnos (nombre, edad, curso) VALUES (?, ?, ?)`, [nombre, edad, curso], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Obtener todos los alumnos
router.get('/alumnos', (req, res) => {
    db.all(`SELECT * FROM alumnos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Obtener un alumno por ID
router.get('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM alumnos WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(row);
    });
});

// Actualizar un alumno por ID
router.put('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, edad, curso } = req.body;
    db.run(`UPDATE alumnos SET nombre = ?, edad = ?, curso = ? WHERE id = ?`, [nombre, edad, curso, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json({ message: 'Alumno actualizado' });
    });
});

// Eliminar un alumno por ID
router.delete('/alumnos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM alumnos WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json({ message: 'Alumno eliminado' });
    });
});

module.exports = router;
