-- Migration: Create invites table
-- Description: Table to store invite codes with API credentials and usage tracking

CREATE TABLE invites (
    id SERIAL PRIMARY KEY,
    invite_code VARCHAR(255) NOT NULL UNIQUE,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    used_by_user_id INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on invite_code for faster lookups
CREATE INDEX idx_invites_invite_code ON invites(invite_code);

-- Create index on status for filtering
CREATE INDEX idx_invites_status ON invites(status);

-- Create index on used_by_user_id for user tracking
CREATE INDEX idx_invites_used_by_user_id ON invites(used_by_user_id);
