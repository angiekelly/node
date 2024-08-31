const sqlite3 = require('sqlite3').verbose();

// Open a database connection to a file named 'alumnos.db'
const db = new sqlite3.Database('alumnos.db');

// SQL query to create the 'alumnos' table if it does not exist
const createTable = `
CREATE TABLE IF NOT EXISTS alumnos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL,
  curso TEXT NOT NULL
);
`;

// Run the SQL query to create the table
db.run(createTable, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table "alumnos" created successfully or already exists.');
  }
});

// Export the database connection for use in other modules
module.exports = db;

