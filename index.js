const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
require('dotenv').config()

const port = process.env.PORT||5000;

app.use(cors({
    origin:[
        'http://localhost:5173'
    ]
}));

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("MySQL connected.........")
})

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

app.get('/', (req,res) =>{
    res.send("Student Portal Website running ")
})

  // Start server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});