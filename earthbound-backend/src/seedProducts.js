require('dotenv').config();
const pool = require('./config/db');

const seedProducts = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected — seeding products...');

        // Clear existing products
        await connection.query('DELETE FROM order_items');
        await connection.query('DELETE FROM products');
        // Reset auto-increment
        await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');

        // Products matching the database screenshot, using local assets where available
        const products = [
            {
                name: 'camping tent',
                description: 'Durable, weather-resistant shelter for outdoor expeditions. Fits up to 4 people comfortably.',
                price: 8000.00,
                category: 'shelter',
                activity: 'Camping',
                image_url: 'assets/camping.jpg',
                stock: 20
            },
            {
                name: 'ski gear',
                description: 'Complete snow sports gear set. Includes goggles, gloves, and essential accessories.',
                price: 850.00,
                category: 'Snow',
                activity: 'Outdoor',
                image_url: 'assets/ski_gear.jpg',
                stock: 10
            },
            {
                name: 'winter jacket',
                description: 'Premium insulated winter jacket. Waterproof, windproof, and built for extreme cold.',
                price: 299.00,
                category: 'Snow',
                activity: 'Outdoor',
                image_url: 'assets/jacket.jpg',
                stock: 15
            },
            {
                name: 'fishing rod',
                description: 'Professional-grade carbon fiber fishing rod. Lightweight with excellent sensitivity.',
                price: 150.00,
                category: 'Fishing',
                activity: 'Outdoor',
                image_url: 'assets/fishing_rod.jpg',
                stock: 20
            },
            {
                name: 'fishing kit',
                description: 'Complete fishing tackle kit with lures, hooks, bobbers, and organized carry case.',
                price: 85.00,
                category: 'Fishing',
                activity: 'Outdoor',
                image_url: 'assets/kit.jpg',
                stock: 30
            },
            {
                name: 'rechargeable outdoor light',
                description: 'Bright LED rechargeable light sticks for camping, emergencies, and night adventures.',
                price: 45.00,
                category: 'Electronics',
                activity: 'Camping',
                image_url: 'assets/rechargeable_outdoor_light.jpg',
                stock: 50
            },
            {
                name: 'outdoor flashlight',
                description: 'Tactical LED flashlight with multiple brightness modes. Rugged and waterproof.',
                price: 35.00,
                category: 'Electronics',
                activity: 'Hiking',
                image_url: 'assets/outdoor_flashlight.jpg',
                stock: 100
            },
            {
                name: 'compass',
                description: 'Precision brass hiking compass with glow-in-the-dark dial. Essential navigation tool.',
                price: 40.00,
                category: 'Hiking',
                activity: 'Hiking',
                image_url: 'assets/compass.jpg',
                stock: 60
            },
            {
                name: 'kayak',
                description: 'Single-person recreational kayak. Stable, lightweight, and great for rivers and lakes.',
                price: 799.00,
                category: 'Water',
                activity: 'Outdoor',
                image_url: 'assets/kayak.jpg',
                stock: 5
            },
            {
                name: 'backpack',
                description: 'High-capacity hiking backpack with ergonomic support and multiple compartments.',
                price: 120.00,
                category: 'Hiking',
                activity: 'Hiking',
                image_url: 'assets/backpack.jpg',
                stock: 25
            }
        ];

        for (const p of products) {
            await connection.execute(
                'INSERT INTO products (name, description, price, category, activity, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.description, p.price, p.category, p.activity, p.image_url, p.stock]
            );
            console.log(`  ✓ Seeded product: ${p.name}`);
        }

        // Seed Default Users if they don't exist
        const bcrypt = require('bcryptjs');
        const adminPass = await bcrypt.hash('admin123', 10);
        const userPass = await bcrypt.hash('user123', 10);

        await connection.execute(
            'INSERT IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@earthbound.com', adminPass, 'admin']
        );
        await connection.execute(
            'INSERT IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['user', 'user@earthbound.com', userPass, 'user']
        );
        console.log('  ✓ Seeded default admin and user');

        console.log(`\nDone! ${products.length} products and default users seeded.`);
        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
};

seedProducts();
