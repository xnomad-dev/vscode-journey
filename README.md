# VS Code Journey

A visual progress tracker for your VS Code learning journey. No server, no API, no sign-up — just open `dashboard.html` in your browser and watch your skills grow.

![Dashboard Preview](https://raw.githubusercontent.com/placeholder/vscode-journey/main/preview.png)

---

## What It Tracks

- **Skills** — progress bars from Beginner → Intermediate → Advanced across 12+ skill categories
- **Projects** — every project you build, with status badges and tech stack tags
- **Activity Log** — session-by-session history of what you worked on and what you learned
- **Milestones** — achievements for first-time moments (first deploy, first API, first test, etc.)
- **Stats** — days active, sessions logged, live projects, new things learned

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/vscode-journey.git
cd vscode-journey
```

### 2. Open the dashboard
Just double-click `dashboard.html` — it opens in your browser. No install, no server needed.

### 3. Make it yours
Edit `journey-data.js` to replace the demo data with your own:

```js
profile: {
  name: "Your Name",          // shown in the header
  startDate: "2025-01-01",    // when you started
  totalSessions: 1
}
```

---

## Updating Your Journey

After each coding session, add a new entry to the `sessions` array in `journey-data.js`:

```js
{
  date: "2026-04-15",
  summary: "Built a login form with React and validated it with Zod.",
  skills: ["React", "TypeScript"],
  projects: ["My App"],
  newThings: ["Zod schema validation", "React Hook Form"]
}
```

Then refresh `dashboard.html` — your progress updates instantly.

---

## Skills Reference

The demo includes these skill names. Use the same names in your session `skills` array:

| Skill | Category |
|---|---|
| Python | Language |
| HTML/CSS/JS | Language |
| Git & GitHub | DevOps |
| APIs & Integration | Backend |
| Debugging | Language |
| React | Framework |
| Node.js | Backend |
| Deployment | DevOps |
| SQL & Databases | Database |
| TypeScript | Language |
| Docker | DevOps |
| Testing | Testing |

Add your own by appending to the `skills` array in `journey-data.js`.

---

## Auto-Update with Claude Code (Optional)

If you use [Claude Code](https://claude.ai/code), include the `CLAUDE.md` file in your project root. Claude will automatically update your journey data at the end of every session — no manual logging needed.

---

## Customisation

All data lives in `journey-data.js`. The dashboard reads from it with no build step.

| What to change | Where |
|---|---|
| Your name / start date | `profile` object |
| Add a skill | Append to `skills` array |
| Add a project | Append to `projects` array |
| Log a session | Prepend to `sessions` array |
| Add a milestone | Append to `milestones` array |

---

## Project Structure

```
vscode-journey/
├── dashboard.html      ← open this in your browser
├── journey-data.js     ← edit this with your data
├── CLAUDE.md           ← optional: auto-update with Claude Code
└── README.md
```

---

## Skill Levels

| Progress | Level |
|---|---|
| 0 – 33% | Beginner |
| 34 – 66% | Intermediate |
| 67 – 100% | Advanced |

Adjust your skill `progress` values honestly as you grow.

---

## License

MIT — free to use, fork, and share.
