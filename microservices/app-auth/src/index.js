const express = require('express');
const app = express();
const connection = require("./db")
app.use((req, res, next) => {
  console.log(`Incoming path: ${req.path}`);
  next();
});
app.get('/auth', (req, res) => res.send('Hello from Auth Service!'));

app.get('/auth/userpost', (req, res) => {
  const name = `Test-${Date.now()}`; // Unique name for each test
  const sql = 'INSERT INTO users (name) VALUES (?)';
  
  connection.query(sql, [name], (err, results) => {
    if (err) {
      console.error('❌ Insert failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`✅ Inserted ID: ${results.insertId}`);
    res.json({ 
      success: true,
      id: results.insertId,
      name: name
    });
  });
});

app.get('/auth/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching users:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
app.listen(4000, () => console.log('Auth running on port 4000'));
