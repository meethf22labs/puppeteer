CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    capital TEXT,
    population BIGINT,
    area REAL,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
x