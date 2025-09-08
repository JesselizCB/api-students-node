const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('students.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create students table
const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            gender TEXT NOT NULL,
            age TEXT
        )
    `;

    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Students table created or already exists');
        }
    });
};

createTable();

module.exports = db; 