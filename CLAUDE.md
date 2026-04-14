# Claude Code Auto-Update Instructions

If you use **Claude Code**, add these instructions so Claude automatically updates your journey at the end of every session — no manual effort needed.

## How It Works

At the end of every session where you wrote code, Claude will update `journey-data.js` with:
- A new session entry (date, summary, skills used, new things learned)
- Updated skill session counts and `lastUsed` dates
- New milestones if you did something for the first time
- Incremented `profile.totalSessions`

## Instructions for Claude

At the end of every coding session, you MUST update `journey-data.js`:

1. Add a new entry to the `sessions` array at the **TOP** (most recent first):
   - `date`: today's date (YYYY-MM-DD)
   - `summary`: 1-2 sentence description of what was done
   - `skills`: array of skill names used (must match names in the `skills` array)
   - `projects`: array of project names worked on
   - `newThings`: specific new things learned or done for the first time (empty array if nothing new)

2. For each skill used, increment its `sessions` count and update `lastUsed`.

3. If something genuinely new was achieved (first deployment, first use of a tool, first time a concept clicked), add a milestone to the `milestones` array.

4. Increment `profile.totalSessions` by 1.

Do this automatically at session end, without being asked.
