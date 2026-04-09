const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { name: 'compass', image: 'https://images.unsplash.com/photo-1501554497402-d58f25d38312?q=80&w=800&auto=format&fit=crop' },
  { name: 'kayak', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800&auto=format&fit=crop' },
  { name: 'hiking boot', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop' },
  { name: 'swim suit', image: 'https://images.unsplash.com/photo-1572314493295-09e666a01c3d?q=80&w=800&auto=format&fit=crop' },
  { name: 'hydration pack', image: 'https://images.unsplash.com/photo-1533221216319-387497453181?q=80&w=800&auto=format&fit=crop' },
  { name: 'mountain bike', image: 'https://images.unsplash.com/photo-1532298229144-0ee051189ff7?q=80&w=800&auto=format&fit=crop' },
  { name: 'cycling helmet', image: 'https://images.unsplash.com/photo-1557613527-3079b77eb7f4?q=80&w=800&auto=format&fit=crop' }
];

async function updateAllImages() {
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

updateAllImages();
