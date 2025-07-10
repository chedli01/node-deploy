const mysql = require('mysql2');

console.log('Attempting to connect to MySQL with:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: 'authdb'
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'authdb',
});

connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', {
      message: err.message,
      code: err.code,
      address: err.address,
      port: err.port,
      fatal: err.fatal,
      stack: err.stack
    });
    process.exit(1); // Exit if DB connection fails
  } else {
    console.log('✅ Connected to MySQL');
  }
});

connection.on('error', err => {
  console.error('❌ MySQL connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect...');
    connection.connect();
  } else {
    throw err;
  }
});

module.exports = connection;