-- Fix approved_tools to allow manually added tools without submission_id
-- This removes the NOT NULL constraint and foreign key constraint on submission_id

-- Drop the old approved_tools table and recreate without foreign key
DROP TABLE IF EXISTS approved_tools;

CREATE TABLE approved_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  phase_number INTEGER NOT NULL,
  phase_title TEXT NOT NULL,
  section_title TEXT NOT NULL,
  use_case TEXT,
  pr_url TEXT,
  pr_number INTEGER,
  visible INTEGER DEFAULT 1 CHECK(visible IN (0, 1)),
  approved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_by TEXT
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_approved_tools_visible ON approved_tools(visible);
