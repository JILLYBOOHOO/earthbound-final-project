const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    console.log('--- Initializing Admin Credentials ---');
    
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'RroJjWAayNeE1@13',
            database: process.env.DB_NAME || 'outdoor_geardb'
        });

        const adminEmail = 'admin@earthbound.com';
        const adminPass = 'admin123';
        const adminUsername = 'Admin';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);

        // Delete existing if any
        await connection.execute('DELETE FROM users WHERE email = ?', [adminEmail]);

        // Insert admin user
        await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [adminUsername, adminEmail, hashedPassword, 'admin']
        );

        console.log('✅ Admin user created/reset successfully!');
        console.log('-----------------------------------');
        console.log('Username: ', adminUsername);
        console.log('Email:    ', adminEmail);
        console.log('Password: ', adminPass);
        console.log('Portal:    Admin Portal');
        console.log('-----------------------------------');

    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

createAdmin();
