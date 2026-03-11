import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description_it TEXT,
    description_en TEXT,
    guests INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    location TEXT,
    map_url TEXT,
    image_url TEXT,
    amenities TEXT
  );

  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_it TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_it TEXT,
    description_en TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description_it TEXT,
    description_en TEXT,
    image_url TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_it TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_it TEXT,
    content_en TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    text_it TEXT,
    text_en TEXT,
    rating INTEGER
  );

  CREATE TABLE IF NOT EXISTS hero_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
  );
`);

// Add images column to existing tables if they don't exist
try { db.exec('ALTER TABLE properties ADD COLUMN images TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE experiences ADD COLUMN images TEXT'); } catch (e) {}
try { db.exec('ALTER TABLE restaurants ADD COLUMN images TEXT'); } catch (e) {}

// Insert some initial data if empty
const propertyCount = db.prepare('SELECT COUNT(*) as count FROM properties').get() as { count: number };
if (propertyCount.count === 0) {
  const insertProperty = db.prepare(`
    INSERT INTO properties (name, description_it, description_en, guests, bedrooms, bathrooms, location, map_url, image_url, amenities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProperty.run(
    'Villa Azzurra',
    'Splendida villa con vista mare ad Amalfi. Goditi il lusso e la tranquillità.',
    'Beautiful villa with sea view in Amalfi. Enjoy luxury and tranquility.',
    6, 3, 2, 'Amalfi', 'https://maps.google.com', 'https://picsum.photos/seed/villa1/800/600', '["WiFi", "Aria Condizionata", "Piscina", "Terrazza"]'
  );
  insertProperty.run(
    'Appartamento Limone',
    'Accogliente appartamento nel centro storico di Positano, a pochi passi dalla spiaggia.',
    'Cozy apartment in the historic center of Positano, a few steps from the beach.',
    4, 2, 1, 'Positano', 'https://maps.google.com', 'https://picsum.photos/seed/apt1/800/600', '["WiFi", "Aria Condizionata", "Cucina Attrezzata"]'
  );

  const insertExperience = db.prepare(`
    INSERT INTO experiences (title_it, title_en, description_it, description_en, image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertExperience.run(
    'Tour in Barca Privato', 'Private Boat Tour',
    'Scopri la costiera dal mare, esplorando calette nascoste e grotte.', 'Discover the coast from the sea, exploring hidden coves and caves.',
    'https://picsum.photos/seed/boat/800/600'
  );
  insertExperience.run(
    'Cooking Class Tradizionale', 'Traditional Cooking Class',
    'Impara a cucinare i piatti tipici della tradizione amalfitana con uno chef locale.', 'Learn to cook typical dishes of the Amalfi tradition with a local chef.',
    'https://picsum.photos/seed/cooking/800/600'
  );
  
  const insertRestaurant = db.prepare(`
    INSERT INTO restaurants (name, description_it, description_en, image_url, location)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertRestaurant.run(
    'La Sponda',
    'Ristorante stellato Michelin con vista mozzafiato su Positano.',
    'Michelin-starred restaurant with breathtaking views of Positano.',
    'https://picsum.photos/seed/restaurant1/800/600',
    'Positano'
  );

  const insertReview = db.prepare(`
    INSERT INTO reviews (author, text_it, text_en, rating)
    VALUES (?, ?, ?, ?)
  `);
  insertReview.run(
    'Marco Rossi',
    'Soggiorno indimenticabile, servizio impeccabile e villa stupenda.',
    'Unforgettable stay, impeccable service and beautiful villa.',
    5
  );
}

export default db;
