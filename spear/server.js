const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'spear_app', 
    password: 'spear_password',
    database: 'EARTHBOUND'
});

db.connect(err => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to Earthbound Database');
});

// Route to handle orders from the website
app.post('/api/orders', (req, res) => {
    const { name, email, address, product, total_price } = req.body;
    const sql = "INSERT INTO orders (name, email, address, product_name, total_price) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [name, email, address, product, total_price], (err, result) => {
        if (err) {
            console.error("❌ DATABASE ERROR during order:", err);
            return res.status(500).json(err);
        }
        console.log("✅ Order received and saved! ID:", result.insertId);
        res.status(200).json({ message: 'Order Placed Successfully!', orderId: result.insertId });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));