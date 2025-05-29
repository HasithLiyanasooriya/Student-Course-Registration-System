const express = require('express');
const pool = require('./db');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/students', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM students');
  res.json(rows);
});

app.get('/students/:id/courses', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT c.title 
     FROM registrations r
     JOIN courses c ON r.course_id = c.course_id
     WHERE r.student_id = $1`,
    [id]
  );
  res.json(rows);
});

app.post('/register', async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO registrations (student_id, course_id)
       VALUES ($1, $2) RETURNING *`,
      [student_id, course_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed (maybe duplicate).' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
