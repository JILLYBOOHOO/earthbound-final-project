const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  const configs = [
    { user: 'root', password: 'JjWAayNeE1@13' },
    { user: 'root', password: '' },
    { user: 'spear_app', password: 'spear_password' },
    { user: 'root', password: 'password' }
  ];

  for (const config of configs) {
    try {
      console.log(`Trying ${config.user} with ${config.password ? 'password' : 'no password'}...`);
      const conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: config.user,
        password: config.password
      });
      console.log(`✅ SUCCESS with ${config.user}`);
      await conn.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ FAILED with ${config.user}: ${err.message}`);
    }
  }
}

testConnection();
