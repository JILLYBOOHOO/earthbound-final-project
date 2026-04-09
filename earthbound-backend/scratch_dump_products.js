const mysql = require('mysql2/promise');
require('dotenv').config();

async function dumpAllProducts() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    const [rows] = await conn.query('SELECT product_ID, product_name, category, image FROM products ORDER BY product_name ASC');
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

dumpAllProducts();
