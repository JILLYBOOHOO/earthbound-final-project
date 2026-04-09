const pool = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const { search, activity, category, minPrice, maxPrice, sort } = req.query;
        let query = "SELECT product_ID as id, product_name as name, description, price, image as image_url, category, '' as activity FROM products WHERE 1=1";
        const params = [];

        if (search) {
            query += ' AND (product_name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            query += ' AND price >= ?';
            params.push(minPrice);
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            query += ' AND price <= ?';
            params.push(maxPrice);
        }
        
        if (sort === 'price_asc') {
            query += ' ORDER BY price ASC';
        } else if (sort === 'price_desc') {
            query += ' ORDER BY price DESC';
        }

        const [products] = await pool.query(query, params);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const [products] = await pool.query("SELECT product_ID as id, product_name as name, description, price, image as image_url, category, '' as activity FROM products WHERE product_ID = ?", [req.params.id]);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(products[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description, price, category, activity, image_url, stock } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO products (product_name, description, price, category, image, quantity) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category, image_url, stock]
        );
        res.status(201).json({ id: result.insertId, name, price });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, description, price, category, activity, image_url, stock } = req.body;
        await pool.execute(
            'UPDATE products SET product_name=?, description=?, price=?, category=?, image=?, quantity=? WHERE product_ID=?',
            [name, description, price, category, image_url, stock, req.params.id]
        );
        res.status(200).json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await pool.execute('DELETE FROM products WHERE product_ID = ?', [req.params.id]);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
