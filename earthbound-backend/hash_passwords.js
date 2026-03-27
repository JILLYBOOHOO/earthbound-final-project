const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function hashExistingPasswords() {
    try {
        console.log('Fetching users...');
        const [users] = await pool.query('SELECT id, password FROM users');
        
        let updatedCount = 0;
        for (const user of users) {
            // Check if passwords are already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
                console.log(`Hashing password for user ID: ${user.id}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
                updatedCount++;
            }
        }
        
        console.log(`Successfully hashed ${updatedCount} passwords.`);
        process.exit(0);
    } catch (err) {
        console.error('Error hashing passwords:', err);
        process.exit(1);
    }
}

hashExistingPasswords();
