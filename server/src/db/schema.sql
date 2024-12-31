

CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  house_number VARCHAR(100),
  street VARCHAR(255),
  area VARCHAR(255),
  landmark VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  full_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);