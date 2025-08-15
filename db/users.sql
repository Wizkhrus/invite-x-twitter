-- Migration: Create users table
-- Description: feat: add users table migration

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    invite_code VARCHAR(255) UNIQUE NOT NULL,
    tg_user_id BIGINT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);
