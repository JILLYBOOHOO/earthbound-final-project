const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { id: 10, image: '/assets/skis_set.webp' },
  { id: 20, image: '/assets/winter_jacket.webp' },
  { id: 30, image: '/assets/fishing_rod.webp' },
  { id: 40, image: '/assets/fishing_kit.webp' },
  { id: 50, image: '/assets/hiking_bag.webp' },
  { id: 60, image: '/assets/tent.webp' },
  { id: 70, image: 'https://images.unsplash.com/photo-1532298229144-0ee051189ff7?q=80&w=800&auto=format&fit=crop' },
  { id: 80, image: 'https://images.unsplash.com/photo-1557613527-3079b77eb7f4?q=80&w=800&auto=format&fit=crop' },
  { id: 90, image: 'https://images.unsplash.com/photo-1544551763-47a0159c9636?q=80&w=800&auto=format&fit=crop' },
  { id: 100, image: 'https://images.unsplash.com/photo-1572314493295-09e666a01c3d?q=80&w=800&auto=format&fit=crop' },
  { id: 111, image: 'https://images.unsplash.com/photo-1533221216319-387497453181?q=80&w=800&auto=format&fit=crop' },
  { id: 339, image: '/assets/backpack.webp' },
  { id: 444, image: 'https://images.unsplash.com/photo-1520639889410-1eb41d73ef9a?q=80&w=800&auto=format&fit=crop' },
  { id: 545, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
  { id: 777, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop' }
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
      const [result] = await conn.execute('UPDATE products SET image = ? WHERE product_ID = ?', [item.image, item.id]);
      console.log(`Updated product ${item.id} with image ${item.image}. Affected rows: ${result.affectedRows}`);
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

updateAllImages();
