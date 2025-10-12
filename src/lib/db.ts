import fs from 'fs';
import path from 'path';

import Database from 'better-sqlite3';

const DEFAULT_DB_PATH = path.join(process.cwd(), 'data', 'mountain-mixology.db');
const dbPath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT,
  guest_count TEXT,
  event_date TEXT,
  budget TEXT,
  location TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  responded_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TRIGGER IF NOT EXISTS bookings_updated_at_trigger
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
  UPDATE bookings SET updated_at = (strftime('%s','now')) WHERE id = NEW.id;
END;
`);

export default db;
