const express = require('express');
const app = express();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mydb' // make sure this exists or create on app start
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
})
app.get('/', (req, res) => res.send('Hello from Product Service!'));
app.listen(5000, () => console.log('Product running on port 5000'));
