# Contributing to PRDraft

Thanks for your interest in contributing. PRDraft is a solo-built GitHub App from Kerala, India — every contribution matters.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A GitHub account
- A Supabase project (free tier works)
- A Groq API key (free at console.groq.com)

### Local Setup

```bash
git clone https://github.com/Jeffrin-dev/prdraft-app
cd prdraft-app
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your keys:
```
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Run locally:
```bash
npm run dev
```

Use [smee.io](https://smee.io) to tunnel GitHub webhooks to localhost.

---

## How to Contribute

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Open a PR — PRDraft will auto-write the description for you
5. Review the generated description, edit if needed, submit

---

## Pull Request Format

> **Note:** PRDraft is installed on this repo and will auto-generate your PR description from the diff. You can edit the generated description before submitting.

If PRDraft hasn't generated a description, or you're writing one manually, use this format:

```markdown
## What changed
- [bullet points describing the actual code changes]

## Why
[One paragraph explaining the reason for the change]

## How to test
- [Step-by-step instructions for reviewers to verify the change]

## Notes
[Anything else reviewers should know — edge cases, follow-ups, known issues]
[Write "None" if nothing to add]
```

### PR Title Format

Use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance, refactoring
- `docs:` — documentation only

Example: `feat: add CONTRIBUTING.md support for open source repos`

---

## What to Work On

Check the [Issues](https://github.com/Jeffrin-dev/prdraft-app/issues) tab for open tasks.

High-priority areas:
- **CONTRIBUTING.md awareness** — teach PRDraft to read a repo's CONTRIBUTING.md and follow its PR format automatically
- **Prompt quality** — improve the Groq prompt for complex, multi-file diffs
- **Dashboard improvements** — better activity display, team-level stats

---

## Code Style

- TypeScript everywhere
- No unused imports
- Keep API routes thin — business logic goes in `/lib`
- Use Supabase client from `/lib/supabase.ts`

---

## Questions?

Open a [GitHub Discussion](https://github.com/Jeffrin-dev/prdraft-app/discussions) or reach out via the landing page at [prdraft.carrd.co](https://prdraft.carrd.co).
