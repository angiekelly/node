const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 8001;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Endpoint para obtener todos los alumnos
app.get('/alumnos', (req, res) => {
    db.all("SELECT * FROM alumnos", [], (err, rows) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.status(200).json({status: 'success', data: rows});
    });
});

// Endpoint para obtener un alumno por ID
app.get('/alumnos/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM alumnos WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        if (!row) {
            return res.status(404).json({"error": "Alumno no encontrado"});
        }
        res.status(200).json({status: 'success', data: row});
    });
});

// Endpoint para agregar un nuevo alumno
app.post('/alumnos', (req, res) => {
    const { nombre, edad, curso } = req.body;
    if (!nombre || !edad || !curso) {
        return res.status(400).json({"error": "Nombre, edad y curso son requeridos"});
    }
    const sql = `INSERT INTO alumnos (nombre, edad, curso) VALUES (?, ?, ?)`;
    db.run(sql, [nombre, edad, curso], function(err) {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.status(201).json({ status: 'success', "id": this.lastID });
    });
});

// Endpoint para actualizar un alumno por ID
app.put('/alumnos/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, edad, curso } = req.body;

    // Verificar que al menos uno de los campos sea proporcionado
    if (!nombre && !edad && !curso) {
        return res.status(400).json({ "error": "Se requiere al menos un campo para actualizar" });
    }

    // Construir la instrucción SQL dinámicamente
    let sql = `UPDATE alumnos SET `;
    let params = [];

    if (nombre) {
        sql += `nombre = ?, `;
        params.push(nombre);
    }
    if (edad) {
        sql += `edad = ?, `;
        params.push(edad);
    }
    if (curso) {
        sql += `curso = ?, `;
        params.push(curso);
    }

    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    sql += ` WHERE id = ?`;
    params.push(id);

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Alumno no encontrado" });
        }
        res.status(200).json({ "status": "success", "message": "Alumno actualizado exitosamente" });
    });
});

// Endpoint para eliminar un alumno por ID
app.delete('/alumnos/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM alumnos WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Alumno no encontrado" });
        }
        res.status(200).json({ "status": "success", "message": "Alumno eliminado exitosamente" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

