const mysql = require('mysql2/promise');
require('dotenv').config();

const updates = [
  { name: 'compass', image: '/assets/compass.jpg' },
  { name: 'camping tent', image: '/assets/tent.webp' },
  { name: 'ski gear', image: '/assets/skis_set.webp' },
  { name: 'winter jacket', image: '/assets/winter_jacket.webp' },
  { name: 'fishing rod', image: '/assets/fishing_rod.webp' },
  { name: 'fishing kit', image: '/assets/fishing_kit.webp' },
  { name: 'rechargeable outdoor light', image: '/assets/rechargeable_outdoor_light.jpg' },
  { name: 'outdoor flashlight', image: '/assets/outdoor_flashlight.jpg' },
  { name: 'kayak', image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=800&auto=format&fit=crop' },
  { name: 'snorkeling gear', image: 'https://images.unsplash.com/photo-1518115392070-580798939a9c?q=80&w=800&auto=format&fit=crop' },
  { name: 'swim suit', image: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=800&auto=format&fit=crop' },
  { name: 'hydration pack', image: 'https://images.unsplash.com/photo-1533221216319-387497453181?q=80&w=800&auto=format&fit=crop' },
  { name: 'hiking boot', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop' },
  { name: 'running shoe', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
  { name: 'sleeping bag', image: 'https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?q=80&w=800&auto=format&fit=crop' },
  { name: 'backpack', image: '/assets/backpack.webp' }
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
