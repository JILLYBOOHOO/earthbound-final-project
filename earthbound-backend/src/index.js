require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConfig = require('./config/db');
const initDB = require('./config/initDb');

const app = express();
const compression = require('compression');

app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from Angular dist folder with 1-year cache
const frontendDist = path.join(__dirname, '../../earthbound-frontend/dist/earthbound-frontend');
app.use(express.static(frontendDist, {
  maxAge: '1y',
  setHeaders: (res, file) => {
    if (file.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate'); // Never cache index.html
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache assets!
    }
  }
}));

// Load routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const seoRoutes = require('./routes/seo.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seo', seoRoutes);

// Fallback route for Angular Client-Side Routing
app.use((req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Initialize DB and Start
initDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Backend and Production Frontend running on port ${PORT}`));
});
