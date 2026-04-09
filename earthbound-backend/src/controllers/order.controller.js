const pool = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.date DESC'
        );
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC',
            [req.user.id]
        );
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { shipping_address, total_price, items } = req.body;
        const orderId = 'EB-' + Math.floor(100000 + Math.random() * 900000);
        
        const [result] = await connection.execute(
            'INSERT INTO orders (id, user_id, address, total_price, total, customer_name, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [orderId, req.user.id, shipping_address, total_price, total_price, req.body.customer_name || 'Explorer', 'Pending', new Date()]
        );
        
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }
        
        await connection.commit();
        res.status(201).json({ id: orderId, message: 'Order placed successfully' });
    } catch (err) {
        await connection.rollback();
        const fs = require('fs');
        fs.appendFileSync('order_error.log', JSON.stringify({ body: req.body, user: req.user, error: err.message, stack: err.stack }) + '\n');
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { shipping_status, tracking_number } = req.body;
        const [result] = await pool.execute(
            'UPDATE orders SET status = ?, tracking_number = ? WHERE id = ?',
            [shipping_status, tracking_number, req.params.id]
        );
        res.status(200).json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
