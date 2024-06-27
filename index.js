const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
require('dotenv').config()

const port = process.env.PORT||5000;

app.use(cors("*"));

app.use(express.json());

const dbConfig = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME
};

// Validate input data
const validateStudentData = (data) => {
    const errors = {};
    if (!data.first_name || data.first_name.length > 50) {
      errors.first_name = 'First name is required and must be 50 characters or less';
    }
    if (!data.last_name || data.last_name.length > 50) {
      errors.last_name = 'Last name is required and must be 50 characters or less';
    }
    if (!['Male', 'Female', 'Other'].includes(data.gender)) {
      errors.gender = 'Gender is required and must be either Male, Female, or Other';
    }
    if (!data.address || data.address.length > 100) {
      errors.address = 'Address is required and must be 100 characters or less';
    }
    if (!data.phone_no || !/^[0-9]+$/.test(data.phone_no) || data.phone_no.length > 20) {
      errors.phone_no = 'Phone number is required, must be only digits, and must be 20 characters or less';
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Valid email is required';
    }
    if (data.photo && data.photo.length > 50) {
      errors.photo = 'Photo must be 50 characters or less';
    }
    if (data.vio_details && data.vio_details.length > 250) {
      errors.vio_details = 'Violations details must be 250 characters or less';
    }
    if (data.thana && data.thana.length > 50) {
      errors.thana = 'Thana must be 50 characters or less';
    }
    return errors;
  };

  app.get('/students', async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig);
      const [rows] = await db.query('SELECT * FROM students');
      res.json(rows);
      db.end();
    } catch (err) {
      console.error('Error retrieving students:', err);
      res.status(500).send('Server error');
    }
  });

  app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const db = await mysql.createConnection(dbConfig);
      const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
  
      if (rows.length === 0) {
        res.status(404).json({ message: 'Student not found' });
      } else {
        res.json(rows[0]);
      }
  
      db.end();
    } catch (err) {
      console.error('Error retrieving student:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/students', async (req, res) => {
    const errors = validateStudentData(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
  
    const { first_name, last_name, gender, address, phone_no, email, photo, bio_details, thana } = req.body;
    const sql = 'INSERT INTO students (first_name, last_name, gender, address, phone_no, email, photo, vio_details, thana) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    try {
      const db = await mysql.createConnection(dbConfig);
      const [result] = await db.query(sql, [first_name, last_name, gender, address, phone_no, email, photo, bio_details, thana]);
      res.status(201).json({ message: 'Student added', id: result.insertId });
      db.end();
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const db = await mysql.createConnection(dbConfig);
      const [result] = await db.query('DELETE FROM students WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Student not found' });
      } else {
        res.status(200).json({ message: 'Student deleted' });
      }
  
      db.end();
    } catch (err) {
      console.error('Error deleting student:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.get('/', (req,res) =>{
    res.send("Student Portal Website running ")
})

  // Start server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});