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

// Maximize browser caching for static assets (images, fonts, scripts)
const frontendDist = path.join(__dirname, '../../earthbound-frontend/dist/earthbound-frontend');

// Dedicated assets caching
app.use('/assets', express.static(path.join(frontendDist, 'assets'), {
  maxAge: '1y',
  immutable: true,
  lastModified: false,
  etag: true
}));

// Main static build files caching
app.use(express.static(frontendDist, {
  maxAge: '1y',
  setHeaders: (res, file) => {
    if (file.endsWith('.html')) {
      // index.html should never be cached to ensure users get the latest build
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (file.match(/\.(js|css|woff2|webp|jpg|png|svg)$/)) {
      // Fingerprinted JS/CSS and images should be cached for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
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
