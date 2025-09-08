const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET all students
app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST new student
app.post('/students', (req, res) => {
    const { firstname, lastname, gender, age } = req.body;
    
    if (!firstname || !lastname || !gender || !age) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
    db.run(sql, [firstname, lastname, gender, age], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Student with id: ${this.lastID} created successfully` });
    });
});

// GET single student
app.get('/student/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json(row);
    });
});

// PUT update student
app.put('/student/:id', (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, gender, age } = req.body;

    if (!firstname || !lastname || !gender || !age) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
    db.run(sql, [firstname, lastname, gender, age, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({
            id: parseInt(id),
            firstname,
            lastname,
            gender,
            age
        });
    });
});

// DELETE student
app.delete('/student/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({ message: `The Student with id: ${id} has been deleted.` });
    });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}); 