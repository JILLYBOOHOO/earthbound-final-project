const mysql = require('mysql2/promise');
require('dotenv').config();

async function findSpecificProducts() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    const names = ["compass", "kayak", "hiking boot", "swim suit", "hydration pack"];
    const [rows] = await conn.query('SELECT product_ID, product_name, image FROM products WHERE product_name IN (?)', [names]);
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

findSpecificProducts();
