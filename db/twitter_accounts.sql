-- Migration: feat: add migration for multiple twitter accounts per invite
-- Created: 2025-08-15

CREATE TABLE twitter_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  twitter_user_id VARCHAR(255) NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better performance
  INDEX idx_twitter_accounts_user_id (user_id),
  INDEX idx_twitter_accounts_twitter_user_id (twitter_user_id),
  INDEX idx_twitter_accounts_screen_name (screen_name),
  
  -- Constraints
  UNIQUE KEY unique_user_twitter (user_id, twitter_user_id)
);
