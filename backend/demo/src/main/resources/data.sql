-- Simple seed user for testing (idempotent)
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin123');