const express = require('express');
const app = express();
const amqp = require('amqplib');

async function startListener() {
  try {
    const conn = await amqp.connect('amqp://rabbitmq-service');
    const channel = await conn.createChannel();
    
    const queue = 'test_queue';
    await channel.assertQueue(queue, { durable: false });
    
    console.log("🔄 Waiting for messages...");
    
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log("📥 Received:", msg.content.toString());
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("❌ RabbitMQ error:", err.message);
    setTimeout(startListener, 5000); // Reconnect after 5 seconds
  }
}

// Start listener on service start

app.get('/', (req, res) => res.send('Hello from Product Service!'));
startListener();

app.listen(5000, () => console.log('Product running on port 5000'));
