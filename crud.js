// const express = require('express');
// const { Pool } = require('pg');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const router = express.Router();

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'CCIS-FTMS',
//   password: 'Pass@word222',
//   port: 5432,
// });

// // Endpoint for fetching faculty trainings
// router.get('/faculty_trainings', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM faculty_trainings');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching faculty trainings', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint for adding a new faculty training
// router.post('/faculty_trainings', upload.single('picture'), async (req, res) => {
//   try {
//     // Your code for processing the uploaded file
//     const { name, email, phone, start_date } = req.body;
//     const picture = req.file ? req.file.buffer : null;

//     const result = await pool.query(
//       'INSERT INTO faculty_trainings (picture, name, email, phone, start_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//       [picture, name, email, phone, start_date]
//     );

//     const newRecord = result.rows[0];
//     res.status(201).json(newRecord);
//   } catch (error) {
//     console.error('Error adding faculty training record', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint for updating a faculty training record
// router.put('/faculty_trainings/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { picture, employeeName, employeeEmail, employeePhone, startDate } = req.body;

//     // Update the faculty training record in the database
//     await pool.query('UPDATE faculty_trainings SET picture = $1, employee_name = $2, employee_email = $3, employee_phone = $4, start_date = $5 WHERE id = $6',
//       [picture, employeeName, employeeEmail, employeePhone, startDate, id]);

//     res.status(200).json({ message: 'Faculty training record updated successfully' });
//   } catch (error) {
//     console.error('Error updating faculty training record', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Endpoint for deleting a faculty training record
// router.delete('/faculty_trainings/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Delete the faculty training record from the database
//     await pool.query('DELETE FROM faculty_trainings WHERE id = $1', [id]);

//     res.status(200).json({ message: 'Faculty training record deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting faculty training record', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;
