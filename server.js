const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import the cors middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

// Add this middleware to handle preflight requests (OPTIONS requests)
app.options('*', cors());



const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CCIS-FTMS',
  password: 'Pass@word222',
  port: 5432,
});

// Endpoint for fetching faculty data
app.get('/data/faculty', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculty');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for fetching admin data
app.get('/data/admin', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM admin');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the username is unique
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user from the database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    // Check if the user exists and verify the password
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: 'Login successful', role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for fetching faculty trainings
app.get('/faculty_trainings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculty_trainings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching faculty trainings', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for adding a new faculty training
app.post('/faculty_trainings', upload.single('certificate'), async (req, res) => {
  try {
    // Your code for processing the uploaded file
    const { id, name, type, hours, startDate, endDate } = req.body;
    const certificate = req.file ? req.file.buffer : null;

    const result = await pool.query(
      'INSERT INTO faculty_trainings (certificate, name, type, hours, startDate, endDate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [certificate, name, type, hours, startDate, endDate]
    );

    const newRecord = result.rows[0];
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding faculty training record', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for updating a faculty training record
app.put('/faculty_trainings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { certificate, facultyName, trType, trHours, Startdate, Enddate } = req.body;

    // Update the faculty training record in the database
    await pool.query('UPDATE faculty_trainings SET certificate = $1, faculty_name = $2, tr_type = $3, tr_hours = $4, start_date = $5, end_date = $6 WHERE id = $7',
      [certificate, facultyName, trType, trHours, Startdate, Enddate]);

    res.status(200).json({ message: 'Faculty training record updated successfully' });
  } catch (error) {
    console.error('Error updating faculty training record', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for deleting a faculty training record
app.delete('/faculty_trainings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the faculty training record from the database
    await pool.query('DELETE FROM faculty_trainings WHERE id = $1', [id]);

    res.status(200).json({ message: 'Faculty training record deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty training record', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});