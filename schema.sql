CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  active INTEGER DEFAULT 1,
  maintenanceMessage TEXT,
  activeEventName TEXT
);

CREATE TABLE IF NOT EXISTS frames (
  id TEXT PRIMARY KEY,
  name TEXT,
  canvasWidth INTEGER,
  canvasHeight INTEGER,
  slots TEXT,
  image_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (id, active, maintenanceMessage, activeEventName) 
VALUES ('global', 1, 'Studio Foto sedang dinonaktifkan sementara. Nantikan event spesial berikutnya!', 'Event Spesial');
