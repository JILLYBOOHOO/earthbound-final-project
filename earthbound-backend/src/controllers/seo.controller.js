const { SitemapStream, streamToPromise } = require('sitemap');
const { create } = require('xmlbuilder2');
const pool = require('../config/db');

exports.getSitemap = async (req, res) => {
    try {
        const smStream = new SitemapStream({ hostname: 'http://localhost:4600' });
        
        // Static routes
        smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/products', changefreq: 'daily', priority: 0.8 });
        smStream.write({ url: '/blog', changefreq: 'weekly', priority: 0.6 });
        smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
        
        // Dynamic routes (Products)
        const [products] = await pool.query('SELECT id FROM products');
        products.forEach(p => {
            smStream.write({ url: `/products/${p.id}`, changefreq: 'weekly', priority: 0.7 });
        });
        
        smStream.end();
        const sitemap = await streamToPromise(smStream);
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.toString());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductFeed = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        
        const feed = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('rss', { 'xmlns:g': 'http://base.google.com/ns/1.0', version: '2.0' })
            .ele('channel')
            .ele('title').txt('Earthbound Product Feed').up()
            .ele('link').txt('http://localhost:4600').up()
            .ele('description').txt('Latest products from Earthbound Outdoor Store').up();
            
        products.forEach(p => {
            feed.ele('item')
                .ele('g:id').txt(p.id.toString()).up()
                .ele('g:title').txt(p.name).up()
                .ele('g:description').txt(p.description).up()
                .ele('g:link').txt(`http://localhost:4600/products/${p.id}`).up()
                .ele('g:image_link').txt(p.image_url || 'http://localhost:4600/assets/placeholder.png').up()
                .ele('g:price').txt(`${p.price} USD`).up()
                .ele('g:condition').txt('new').up()
                .ele('g:availability').txt(p.stock > 0 ? 'in stock' : 'out of stock').up()
                .up();
        });
        
        const xml = feed.end({ prettyPrint: true });
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
