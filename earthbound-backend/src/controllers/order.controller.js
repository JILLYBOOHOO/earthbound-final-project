const pool = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY created_at DESC'
        );
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
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
        
        const [result] = await connection.execute(
            'INSERT INTO orders (user_id, address, total_price) VALUES (?, ?, ?)',
            [req.user.id, shipping_address, total_price]
        );
        
        const orderId = result.insertId;
        
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
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { shipping_status, tracking_number } = req.body;
        const [result] = await pool.execute(
            'UPDATE orders SET shipping_status = ?, tracking_number = ? WHERE id = ?',
            [shipping_status, tracking_number, req.params.id]
        );
        res.status(200).json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
