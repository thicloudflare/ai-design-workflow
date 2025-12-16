-- Add visible column to approved_tools table
ALTER TABLE approved_tools ADD COLUMN visible INTEGER DEFAULT 1 CHECK(visible IN (0, 1));

-- Add index for faster queries on visible tools
CREATE INDEX IF NOT EXISTS idx_approved_tools_visible ON approved_tools(visible);
