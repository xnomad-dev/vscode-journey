# VS Code Journey

A visual progress tracker for your VS Code + Claude Code learning journey. Track your skills, projects, and daily sessions — no server, no sign-up, just open `dashboard.html` in your browser.

> Built for **VS Code** users who use **Claude Code** — or anyone who wants to log their dev growth with a free AI API.

![Dashboard Preview](https://raw.githubusercontent.com/xnomad-dev/vscode-journey/main/preview.png)

---

## What It Tracks

- **Skills** — progress bars from Beginner → Intermediate → Advanced
- **Projects** — every project you build with status badges and tech tags
- **Activity Log** — session-by-session history of what you worked on
- **Milestones** — achievements for first-time moments (first deploy, first API, etc.)
- **Stats** — days active, sessions logged, live projects, new things learned

---

## Who Is This For?

This project is built for the combination of **VS Code** + **Claude Code** users.

| You use... | How sessions get logged |
|---|---|
| VS Code + Claude Code | **Automatic** — Claude updates your data at session end via `CLAUDE.md` |
| VS Code + Gemini API (free) | **Semi-automatic** — run `node log-session.js` after each session |
| Any editor | **Manual** — edit `journey-data.js` directly after each session |

No paid subscription required. The Gemini API option is completely free.

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/xnomad-dev/vscode-journey.git
cd vscode-journey
```

### 2. Open the dashboard
Double-click `dashboard.html` — opens in your browser instantly. No install, no server.

### 3. Make it yours
Edit `journey-data.js` and update the profile section:
```js
profile: {
  name: "Your Name",       // shown in the header
  startDate: "2025-01-01", // when you started
  totalSessions: 0
}
```

Replace the demo sessions, skills, and projects with your own, then refresh the dashboard.

---

## Logging Sessions

### Option A — Automatic (Claude Code users)

Include `CLAUDE.md` in your project. Claude Code will automatically update `journey-data.js` at the end of every session. Nothing manual needed.

### Option B — Semi-automatic (Free Gemini API)

**First-time setup** (one time only):
```bash
node log-session.js --setup
```
Follow the prompts to enter your free Gemini API key.
Get your free key at → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

**After each coding session:**
```bash
node log-session.js
```

```
📝  What did you work on today?
    > Built a login form with React and added Zod validation

📁  Project name(s) (or Enter to skip):
    > My App

⚡  Any specific new things you learned?
    > Zod schema validation, React Hook Form

🤖  Analysing with Gemini...

✅  Session logged!
  📋  Summary  : Built a login form in React using Zod for schema validation and React Hook Form for field management.
  🛠   Skills   : React, TypeScript
  📁  Projects : My App
  ⚡  Learned  : Zod schema validation · React Hook Form integration
```

Gemini identifies the skills, structures the entry, detects milestones, and updates your progress bars automatically.

### Option C — Manual

Edit `journey-data.js` directly after each session:

```js
sessions: [
  {
    date: "2026-04-15",
    summary: "Built a login form with React and Zod validation.",
    skills: ["React", "TypeScript"],
    projects: ["My App"],
    newThings: ["Zod schema validation", "React Hook Form"]
  },
  // ... previous sessions
]
```

---

## Project Structure

```
vscode-journey/
├── dashboard.html      ← open in browser to view progress
├── journey-data.js     ← your data (edit this or let the tools update it)
├── log-session.js      ← session logger (uses free Gemini API)
├── CLAUDE.md           ← auto-update instructions for Claude Code users
├── .env.example        ← copy to .env and add your Gemini API key
├── .gitignore          ← keeps .env out of git
└── README.md
```

---

## Customising Skills

The default skills:

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

Add your own by appending to the `skills` array in `journey-data.js`:
```js
{ name: "Rust", icon: "🦀", progress: 10, sessions: 1, lastUsed: "2026-04-15", category: "Language" }
```

---

## Skill Levels

| Progress | Level |
|---|---|
| 0 – 33% | Beginner |
| 34 – 66% | Intermediate |
| 67 – 100% | Advanced |

Each logged session automatically bumps the skill's progress slightly (the gain slows as you advance, reflecting real learning curves).

---

## Requirements

- A modern browser (to view the dashboard)
- Node.js 18+ (only needed for `log-session.js`)
- A free Google account (only needed for the Gemini API option)

No npm install. No build step. No server.

---

## License

MIT — free to use, fork, and share.
