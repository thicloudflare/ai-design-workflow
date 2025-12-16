# Hybrid Auto-Add Tool System - Complete Setup Guide

## 🎉 What's Been Implemented

A complete hybrid workflow for managing tool submissions:

1. **User submits tool** → Saved to D1 database (status: pending)
2. **Email notification** → Admin receives email
3. **Admin reviews** → Via `/admin/submissions` page
4. **Admin approves** → Auto-creates GitHub PR with the tool
5. **Merge PR** → Tool appears on live site

---

## 📦 Files Created/Modified

### Database
- ✅ `schema.sql` - D1 database schema for submissions
- ✅ `SETUP_D1.md` - Step-by-step D1 setup instructions

### API
- ✅ `api-handler.js` - Updated to save submissions to D1
- ✅ `api-admin.js` - New admin endpoints (approve/reject/stats)
- ✅ `worker.js` - Added admin API routes

### Frontend
- ✅ `app/submit/page.tsx` - Updated form with phase/section/icon selection
- ✅ `app/admin/submissions/page.tsx` - New admin dashboard
- ✅ `components/ExpandedView.tsx` - Shows submit CTA for empty sections

### Data
- ✅ `data/phases.ts` - Removed 11 placeholder tools
- ✅ `data/phases-data.js` - Updated JavaScript version for worker

### Configuration
- ✅ `wrangler.toml` - Added D1 database binding

### Documentation
- ✅ `AUTO_ADD_TOOL_GUIDE.md` - Complete guide to all auto-add options

---

## 🚀 Setup Steps

### 1. Create D1 Database

```bash
cd /Users/thile/CascadeProjects/ai-toolkit

# Create the database
npx wrangler d1 create ai-toolkit-db
```

This will output a database ID. Copy it!

### 2. Update wrangler.toml

Replace `your-database-id-here` in `wrangler.toml` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "ai-toolkit-db"
database_id = "paste-your-id-here"
```

### 3. Run Database Migrations

```bash
# Apply schema to production database
npx wrangler d1 execute ai-toolkit-db --file=./schema.sql

# Also create local database for testing
npx wrangler d1 execute ai-toolkit-db --local --file=./schema.sql
```

### 4. Set Secrets

```bash
# Admin password for approval page
npx wrangler secret put ADMIN_PASSWORD
# Enter your desired admin password

# GitHub token for auto-PR creation (optional but recommended)
npx wrangler secret put GITHUB_TOKEN
# Create token at: https://github.com/settings/tokens
# Required permissions: repo (Full control)

# Resend API key (already set, but verify)
npx wrangler secret put RESEND_API_KEY
```

### 5. Build and Deploy

```bash
# Build
npm run build

# Deploy to Cloudflare
npm run deploy
```

---

## 🎯 How to Use

### For Users (Submitting Tools)

1. Go to `/submit`
2. Fill out the form:
   - Your name and email
   - Tool name, URL, description
   - Tool type (Gemini/Miro)
   - Phase and section
3. Submit
4. Wait for email notification when approved

### For Admins (Reviewing Submissions)

1. Go to `/admin/submissions`
2. Enter admin password
3. Review pending submissions
4. Click ✓ to approve (creates GitHub PR automatically)
5. Click ✗ to reject (with optional reason)

---

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/submit` - Submit a new tool

### Admin Endpoints
- `GET /api/admin/submissions` - List pending submissions
- `GET /api/admin/stats` - Get submission statistics
- `POST /api/admin/approve` - Approve submission (creates PR)
- `POST /api/admin/reject` - Reject submission

---

## 🧪 Testing Locally

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Test Submission Flow

Visit `http://localhost:3000/submit` and submit a test tool.

### 3. Check Database

```bash
npx wrangler d1 execute ai-toolkit-db --local --command="SELECT * FROM submitted_tools;"
```

### 4. Test Admin Page

Visit `http://localhost:3000/admin/submissions` and enter your admin password.

---

## 🔐 Security Notes

### Admin Authentication
Currently uses a simple password check. For production:
- Consider adding proper session management
- Use OAuth or more robust auth
- Add rate limiting

### GitHub Token
- Store as Cloudflare secret (not in code)
- Use fine-grained token with minimal permissions
- Regularly rotate tokens

### Database Access
- D1 database is only accessible via Worker
- No direct public access
- All queries use prepared statements (SQL injection safe)

---

## 🐛 Troubleshooting

### "Database not configured" error
- Verify `wrangler.toml` has correct database ID
- Ensure database was created: `npx wrangler d1 list`
- Check binding name is "DB"

### GitHub PR not created
- Check `GITHUB_TOKEN` secret is set: `npx wrangler secret list`
- Verify token has `repo` permission
- Check Worker logs: `npx wrangler tail`

### Submissions not appearing
- Check D1 database: `npx wrangler d1 execute ai-toolkit-db --command="SELECT * FROM submitted_tools;"`
- Verify API endpoint: `curl https://your-worker.workers.dev/api/admin/submissions`

---

## 📊 Database Schema

### submitted_tools
Stores all tool submissions with status tracking.

```sql
- id (primary key)
- name, url, description, icon
- phase_number, phase_title, section_title
- use_case
- status (pending/approved/rejected)
- submitted_by_name, submitted_by_email
- submitted_at, reviewed_at
- rejection_reason
```

### approved_tools
Audit trail of approved submissions.

```sql
- id (primary key)
- submission_id (foreign key)
- All tool details
- pr_url, pr_number
- approved_at, approved_by
```

---

## 🔄 Workflow Diagram

```
User Submits Tool
       ↓
Saved to D1 (status: pending)
       ↓
Email sent to admin
       ↓
Admin reviews in /admin/submissions
       ↓
    Approve → Create GitHub PR → Merge → Tool added to site
       ↓
    Reject → Update status → Email user (future)
```

---

## 🚦 Next Steps

1. **Test the full flow**:
   - Submit a test tool
   - Check database
   - Approve via admin page
   - Verify PR creation

2. **Set up GitHub token** (for auto-PR):
   - Go to https://github.com/settings/tokens
   - Create new token with `repo` permission
   - Add as secret: `npx wrangler secret put GITHUB_TOKEN`

3. **Deploy to production**:
   ```bash
   git add -A
   git commit -m "Implement hybrid auto-add tool system with D1 and admin approval"
   git push origin main
   ```

4. **Monitor submissions**:
   - Check `/admin/submissions` regularly
   - Set up email filters for submission notifications

---

## 📝 Future Enhancements

- [ ] Email notifications to users when approved/rejected
- [ ] Bulk approve/reject
- [ ] Search and filter submissions
- [ ] User submission history
- [ ] Analytics dashboard
- [ ] Auto-merge PRs (with additional checks)
- [ ] Tool preview before approval

---

## 🆘 Need Help?

- Check Worker logs: `npx wrangler tail`
- View database: `npx wrangler d1 execute ai-toolkit-db --command="SELECT * FROM submitted_tools;"`
- Test locally first: `npm run dev`
- Review `AUTO_ADD_TOOL_GUIDE.md` for detailed implementation docs

---

**Status:** ✅ Ready to deploy
**Estimated Setup Time:** 15-20 minutes
