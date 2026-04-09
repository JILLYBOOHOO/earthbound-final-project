const mysql = require('mysql2/promise');
require('dotenv').config();

const fixSchema = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('Updating orders table columns...');
        
        try {
            await connection.execute('ALTER TABLE orders ADD COLUMN address TEXT');
        } catch (e) { console.log('Address column exists.'); }

        try {
            await connection.execute('ALTER TABLE orders ADD COLUMN total_price DECIMAL(10,2)');
        } catch (e) { console.log('Total_price column exists.'); }

        console.log('Creating order_items table with VARCHAR order_id compatibility...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(255) NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);

        console.log('Schema update successful!');
    } catch (err) {
        console.error('Error fixing schema:', err);
    } finally {
        await connection.end();
    }
};

fixSchema();
