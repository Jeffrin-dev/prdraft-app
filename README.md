# PRDraft

A GitHub App that reads your PR diff and auto-writes a structured pull request description — 2-click install, zero config.

## What it does

When you open a pull request, PRDraft:
1. Reads your diff via the GitHub API
2. Sends it to Groq (llama-3.3-70b-versatile) for analysis
3. Posts a structured PR description automatically

No CLI. No YAML config. No API keys to manage.

## Free tier

5 PR descriptions/month — no credit card required.

Install at: [github.com/apps/prdraft](https://github.com/apps/prdraft)

## Tech stack

- **Frontend & Backend:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Groq API (llama-3.3-70b-versatile)
- **GitHub Integration:** Octokit
- **Hosting:** Vercel

## Local development

```bash
# Install dependencies
npm install

# Terminal 1 — webhook tunnel
smee --url https://smee.io/HiyCyQaGwhDna09 --path /api/webhook --port 3000

# Terminal 2 — Next.js dev server
npm run dev
```

## Environment variables

```
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

## Landing page

[prdraft.carrd.co](https://prdraft.carrd.co)

## Dashboard
After installing, view your usage and plan at [prdraft-app.vercel.app/dashboard](https://prdraft-app.vercel.app/dashboard?installation_id=YOUR_ID)

Recent activity now shows PR titles.
