const pool = require('./src/config/db');

async function checkUsers() {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        console.log('Users in database:', users);
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUsers();
