import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './db.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import jwt from 'jsonwebtoken';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(uploadsDir));

  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  app.use('/api', (req, res, next) => {
    if (req.method === 'GET') {
      return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      (req as any).user = user;
      next();
    });
  });

  // Upload endpoint
  app.post('/api/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    });
  });

  // API Routes
  app.get('/api/properties', (req, res) => {
    const properties = db.prepare('SELECT * FROM properties').all();
    res.json(properties.map((p: any) => ({ 
      ...p, 
      amenities: JSON.parse(p.amenities || '[]'),
      images: p.images ? JSON.parse(p.images) : (p.image_url ? [p.image_url] : [])
    })));
  });

  app.get('/api/properties/:id', (req, res) => {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
    if (property) {
      res.json({ 
        ...property, 
        amenities: JSON.parse(property.amenities || '[]'),
        images: property.images ? JSON.parse(property.images) : (property.image_url ? [property.image_url] : [])
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/properties', (req, res) => {
    const { name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, amenities, images } = req.body;
    const stmt = db.prepare(`
      INSERT INTO properties (name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, amenities, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, JSON.stringify(amenities || []), JSON.stringify(images || []));
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/properties/:id', (req, res) => {
    const { name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, amenities, images } = req.body;
    const stmt = db.prepare(`
      UPDATE properties SET name = ?, description_it = ?, description_en = ?, guests = ?, bedrooms = ?, bathrooms = ?, location = ?, map_url = ?, image_url = ?, amenities = ?, images = ?
      WHERE id = ?
    `);
    stmt.run(name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, JSON.stringify(amenities || []), JSON.stringify(images || []), req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/properties/:id', (req, res) => {
    db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Experiences
  app.get('/api/experiences', (req, res) => {
    const experiences = db.prepare('SELECT * FROM experiences').all();
    res.json(experiences.map((e: any) => ({
      ...e,
      images: e.images ? JSON.parse(e.images) : (e.image_url ? [e.image_url] : [])
    })));
  });

  app.get('/api/experiences/:id', (req, res) => {
    const experience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(req.params.id) as any;
    if (experience) {
      res.json({ 
        ...experience, 
        images: experience.images ? JSON.parse(experience.images) : (experience.image_url ? [experience.image_url] : [])
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/experiences', (req, res) => {
    const { title_it, title_en, description_it, description_en, image_url, images } = req.body;
    const stmt = db.prepare(`
      INSERT INTO experiences (title_it, title_en, description_it, description_en, image_url, images)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title_it, title_en, description_it, description_en, image_url, JSON.stringify(images || []));
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/experiences/:id', (req, res) => {
    const { title_it, title_en, description_it, description_en, image_url, images } = req.body;
    const stmt = db.prepare(`
      UPDATE experiences SET title_it = ?, title_en = ?, description_it = ?, description_en = ?, image_url = ?, images = ?
      WHERE id = ?
    `);
    stmt.run(title_it, title_en, description_it, description_en, image_url, JSON.stringify(images || []), req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/experiences/:id', (req, res) => {
    db.prepare('DELETE FROM experiences WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Restaurants
  app.get('/api/restaurants', (req, res) => {
    const restaurants = db.prepare('SELECT * FROM restaurants').all();
    res.json(restaurants.map((r: any) => ({
      ...r,
      images: r.images ? JSON.parse(r.images) : (r.image_url ? [r.image_url] : [])
    })));
  });

  app.get('/api/restaurants/:id', (req, res) => {
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(req.params.id) as any;
    if (restaurant) {
      res.json({ 
        ...restaurant, 
        images: restaurant.images ? JSON.parse(restaurant.images) : (restaurant.image_url ? [restaurant.image_url] : [])
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/restaurants', (req, res) => {
    const { name, description_it, description_en, image_url, location, images } = req.body;
    const stmt = db.prepare(`
      INSERT INTO restaurants (name, description_it, description_en, image_url, location, images)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, description_it, description_en, image_url, location, JSON.stringify(images || []));
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/restaurants/:id', (req, res) => {
    const { name, description_it, description_en, image_url, location, images } = req.body;
    const stmt = db.prepare(`
      UPDATE restaurants SET name = ?, description_it = ?, description_en = ?, image_url = ?, location = ?, images = ?
      WHERE id = ?
    `);
    stmt.run(name, description_it, description_en, image_url, location, JSON.stringify(images || []), req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/restaurants/:id', (req, res) => {
    db.prepare('DELETE FROM restaurants WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Hero Images
  app.get('/api/hero_images', (req, res) => {
    res.json(db.prepare('SELECT * FROM hero_images ORDER BY display_order ASC').all());
  });

  app.post('/api/hero_images', (req, res) => {
    const { image_url, display_order } = req.body;
    const stmt = db.prepare(`
      INSERT INTO hero_images (image_url, display_order)
      VALUES (?, ?)
    `);
    const info = stmt.run(image_url, display_order || 0);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/hero_images/:id', (req, res) => {
    const { image_url, display_order } = req.body;
    const stmt = db.prepare(`
      UPDATE hero_images SET image_url = ?, display_order = ?
      WHERE id = ?
    `);
    stmt.run(image_url, display_order || 0, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/hero_images/:id', (req, res) => {
    db.prepare('DELETE FROM hero_images WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Blog Posts
  app.get('/api/blog', (req, res) => {
    res.json(db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all());
  });

  app.post('/api/blog', (req, res) => {
    const { title_it, title_en, content_it, content_en, image_url } = req.body;
    const stmt = db.prepare(`
      INSERT INTO blog_posts (title_it, title_en, content_it, content_en, image_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title_it, title_en, content_it, content_en, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/blog/:id', (req, res) => {
    const { title_it, title_en, content_it, content_en, image_url } = req.body;
    const stmt = db.prepare(`
      UPDATE blog_posts SET title_it = ?, title_en = ?, content_it = ?, content_en = ?, image_url = ?
      WHERE id = ?
    `);
    stmt.run(title_it, title_en, content_it, content_en, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/blog/:id', (req, res) => {
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    res.json(db.prepare('SELECT * FROM reviews').all());
  });

  app.post('/api/reviews', (req, res) => {
    const { author, text_it, text_en, rating } = req.body;
    const stmt = db.prepare(`
      INSERT INTO reviews (author, text_it, text_en, rating)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(author, text_it, text_en, rating);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/reviews/:id', (req, res) => {
    const { author, text_it, text_en, rating } = req.body;
    const stmt = db.prepare(`
      UPDATE reviews SET author = ?, text_it = ?, text_en = ?, rating = ?
      WHERE id = ?
    `);
    stmt.run(author, text_it, text_en, rating, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/reviews/:id', (req, res) => {
    db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Error handler for API routes
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
