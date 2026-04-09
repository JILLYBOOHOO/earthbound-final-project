const pool = require('../config/db');

const initDB = async () => {
    try {
        const mysql = require('mysql2/promise');
        const tempConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await tempConn.end();

        const connection = await pool.getConnection();
        console.log('Connected to Database for Schema Initialization');

        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            category VARCHAR(100),
            activity VARCHAR(100),
            image_url VARCHAR(255),
            stock INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            shipping_status ENUM('Pending', 'Shipped', 'Out for Delivery', 'Delivered') DEFAULT 'Pending',
            tracking_number VARCHAR(100),
            total_price DECIMAL(10, 2),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Check if orders.id is INT before creating order_items
        const [orderCols] = await connection.query('DESCRIBE orders');
        const idCol = orderCols.find(col => col.Field === 'id');
        const orderIdType = idCol.Type.includes('int') ? 'INT' : 'VARCHAR(50)';

        await connection.query(`CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id ${orderIdType},
            product_id INT,
            quantity INT,
            price DECIMAL(10, 2),
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);

        console.log('Tables initialized or already exist');

        // Seed default admin user if none exists
        const [admins] = await connection.query('SELECT * FROM users WHERE role = "admin"');
        if (admins.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@earthbound.com', hashedPassword, 'admin']
            );
            console.log('Default admin seeded: admin@earthbound.com / admin123');
        }

        connection.release();
    } catch (err) {
        console.error('Database Schema Initialization Failed:', err);
    }
};

module.exports = initDB;
