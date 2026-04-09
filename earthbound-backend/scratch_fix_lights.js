const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { name: 'rechargeable outdoor light', image: '/assets/lantern_v2.webp' },
  { name: 'outdoor flashlight', image: '/assets/flashlight_v2.webp' }
];

async function fixSpecificImages() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    for (const item of updates) {
      const [result] = await conn.execute('UPDATE products SET image = ? WHERE product_name = ?', [item.image, item.name]);
      console.log(`Updated product "${item.name}" with image ${item.image}. Affected rows: ${result.affectedRows}`);
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixSpecificImages();
