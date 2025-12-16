# Cloudflare D1 Database Setup

## Step 1: Create D1 Database

```bash
# Create the database
npx wrangler d1 create ai-toolkit-db

# This will output something like:
# ✅ Successfully created DB 'ai-toolkit-db'
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "ai-toolkit-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` from the output.

## Step 2: Update wrangler.toml

Replace `your-database-id-here` in `wrangler.toml` with your actual database ID.

## Step 3: Run Migrations

```bash
# Apply the schema to your D1 database
npx wrangler d1 execute ai-toolkit-db --file=./schema.sql
```

## Step 4: Test Database Connection

```bash
# List tables
npx wrangler d1 execute ai-toolkit-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check submitted_tools table
npx wrangler d1 execute ai-toolkit-db --command="SELECT * FROM submitted_tools LIMIT 5;"
```

## Step 5: Local Development

For local development, create a local D1 database:

```bash
# Create local database
npx wrangler d1 execute ai-toolkit-db --local --file=./schema.sql

# The local database is stored in .wrangler/state/v3/d1/
```

## Step 6: Add Secrets (Optional - for GitHub integration)

```bash
# Add GitHub token for auto-PR creation
npx wrangler secret put GITHUB_TOKEN

# Add admin password for approval page
npx wrangler secret put ADMIN_PASSWORD
```

## Verify Setup

Once deployed, test the submission endpoint:

```bash
curl -X POST https://your-worker.workers.dev/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "toolName": "Test Tool",
    "toolUrl": "https://example.com",
    "description": "Test description",
    "phaseNumber": 1,
    "phaseTitle": "Discovery",
    "sectionTitle": "A. PRD Review",
    "useCase": "Testing"
  }'
```

## Database Queries

### View all pending submissions
```bash
npx wrangler d1 execute ai-toolkit-db --command="SELECT * FROM submitted_tools WHERE status='pending' ORDER BY submitted_at DESC;"
```

### View approved tools
```bash
npx wrangler d1 execute ai-toolkit-db --command="SELECT * FROM approved_tools ORDER BY approved_at DESC;"
```

### Count submissions by status
```bash
npx wrangler d1 execute ai-toolkit-db --command="SELECT status, COUNT(*) as count FROM submitted_tools GROUP BY status;"
```
