const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  const [rows] = await conn.execute(
    "SELECT product_ID as id, product_name as name, image as image_url, category FROM products WHERE category IN ('Fishing', 'Snow', 'bags') LIMIT 10"
  );
  console.log(JSON.stringify(rows, null, 2));
  await conn.end();
})();
