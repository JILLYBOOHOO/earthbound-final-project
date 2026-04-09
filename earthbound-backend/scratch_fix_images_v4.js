const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { name: 'compass', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=800' },
  { name: 'kayak', image: 'https://images.unsplash.com/photo-1559139237-98a651e663ba?auto=format&fit=crop&q=80&w=800' },
  { name: 'snorkeling gear', image: 'https://images.unsplash.com/photo-1544551763-47a0159c9636?auto=format&fit=crop&q=80&w=800' },
  { name: 'swim suit', image: 'https://images.unsplash.com/photo-1572314493295-09e666a01c3d?auto=format&fit=crop&q=80&w=800' },
  { name: 'hydration pack', image: 'https://images.unsplash.com/photo-1533221216319-387497453181?auto=format&fit=crop&q=80&w=800' }
];

async function updateSpecificImages() {
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

updateSpecificImages();
