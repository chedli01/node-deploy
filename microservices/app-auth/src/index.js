const express = require('express');
const app = express();
const connection = require("./db")
const amqp = require('amqplib');

async function sendMessage() {
  try {
    const conn = await amqp.connect('amqp://rabbitmq-service');
    const channel = await conn.createChannel();
    
    const queue = 'test_queue';
    await channel.assertQueue(queue, { durable: false });
    
    const msg = `Test message at ${new Date().toISOString()}`;
    channel.sendToQueue(queue, Buffer.from(msg));
    
    console.log("✅ Sent:", msg);
    await channel.close();
    await conn.close();
  } catch (err) {
    console.error("❌ RabbitMQ error:", err.message);
  }
}

app.use((req, res, next) => {
  console.log(`Incoming path: ${req.path}`);
  next();
});
app.get('/auth', (req, res) => res.send('Hello from Auth Service!'));


app.get('/auth/send', async (req, res) => {
  await sendMessage();
  res.send('Message sent to RabbitMQ');
});


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
