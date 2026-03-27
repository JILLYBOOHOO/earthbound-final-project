require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConfig = require('./config/db');
const initDB = require('./config/initDb');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Earthbound Backend API is Running</h1><p>Visit <b><a href="http://localhost:4600">localhost:4600</a></b> to see your new website!</p>');
});

// Load routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const seoRoutes = require('./routes/seo.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seo', seoRoutes);

// Initialize DB and Start
initDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
