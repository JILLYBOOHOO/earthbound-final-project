const mysql = require('mysql2/promise');
require('dotenv').config();

async function showSchema() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.query('DESCRIBE products');
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

showSchema();
