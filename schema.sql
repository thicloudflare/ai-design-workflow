-- Cloudflare D1 Database Schema for AI Design Workflow

-- Table for pending tool submissions
CREATE TABLE IF NOT EXISTS submitted_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT CHECK(icon IN ('gemini', 'miro')),
  phase_number INTEGER NOT NULL CHECK(phase_number BETWEEN 1 AND 5),
  phase_title TEXT NOT NULL,
  section_title TEXT NOT NULL,
  use_case TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  submitted_by_name TEXT,
  submitted_by_email TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  reviewed_by TEXT,
  rejection_reason TEXT
);

-- Table for approved tools (backup/audit trail)
CREATE TABLE IF NOT EXISTS approved_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
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
  approved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_by TEXT,
  FOREIGN KEY (submission_id) REFERENCES submitted_tools(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_submitted_tools_status ON submitted_tools(status);
CREATE INDEX IF NOT EXISTS idx_submitted_tools_phase ON submitted_tools(phase_number);
CREATE INDEX IF NOT EXISTS idx_submitted_tools_submitted_at ON submitted_tools(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_approved_tools_submission ON approved_tools(submission_id);
