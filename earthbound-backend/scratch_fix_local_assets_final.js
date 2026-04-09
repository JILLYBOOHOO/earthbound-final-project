const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { name: 'swim suit', image: '/assets/swim_suit_product.jpg' },
  { name: 'compass', image: '/assets/compass_product.jpg' },
  { name: 'kayak', image: '/assets/kayak_product.jpg' },
  { name: 'snorkeling gear', image: '/assets/snorkeling_gear_product.jpg' }
];

async function updateImages() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    for (const item of updates) {
      const [result] = await conn.execute('UPDATE products SET image = ? WHERE product_name = ?', [item.image, item.name]);
      console.log(`Updated product "${item.name}" -> ${item.image}. Affected rows: ${result.affectedRows}`);
    }

    await conn.end();
    console.log('\nDone! All product images updated to local assets.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

updateImages();
