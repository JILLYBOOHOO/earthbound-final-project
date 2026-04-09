const mysql = require('mysql2/promise');
require('dotenv').config();

const addHelmet = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    const helmet = {
        id: 778, // Manual ID since column is not auto-increment
        name: 'Apex Summit Climbing Helmet',
        description: 'Ultra-lightweight, high-impact polycarbonate shell with expanded polystyrene foam liner. Features 12 vents for maximum airflow and a secure adjustment system for extreme vertical missions.',
        price: 89.99,
        category: 'Hiking',
        image_url: 'assets/helmet.png',
        stock: 25
    };

    try {
        const [result] = await connection.execute(
            'INSERT INTO products (product_ID, product_name, description, price, category, image, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [helmet.id, helmet.name, helmet.description, helmet.price, helmet.category, helmet.image_url, helmet.stock]
        );
        console.log('Successfully added helmet! ID:', helmet.id);
    } catch (err) {
        console.error('Error adding helmet:', err);
    } finally {
        await connection.end();
    }
};

addHelmet();
