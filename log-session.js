#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  VS Code Journey — Session Logger
//  Uses Google Gemini free API + git diff to log sessions automatically.
//
//  First time?           node log-session.js --setup
//  Log a session:        node log-session.js
//  Specify project dir:  node log-session.js --project /path/to/your/project
// ─────────────────────────────────────────────────────────────────────────────

const readline    = require('readline');
const https       = require('https');
const fs          = require('fs');
const path        = require('path');
const vm          = require('vm');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, 'journey-data.js');
const ENV_FILE  = path.join(__dirname, '.env');

// ── .env loader ───────────────────────────────────────────────────────────────
function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  fs.readFileSync(ENV_FILE, 'utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).trim();
      if (k && !process.env[k]) process.env[k] = v;
    }
  });
}

// ── Parse --project argument ──────────────────────────────────────────────────
function getProjectDir() {
  const idx = process.argv.indexOf('--project');
  if (idx !== -1 && process.argv[idx + 1]) {
    return path.resolve(process.argv[idx + 1]);
  }
  // Default: current working directory (run from your project folder)
  return process.cwd();
}

// ── Git helpers ───────────────────────────────────────────────────────────────
function git(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return '';
  }
}

function getGitContext(dir) {
  // Confirm it's a git repo
  const root = git('git rev-parse --show-toplevel', dir);
  if (!root) return null;

  const repoName = path.basename(root);

  // Commits made in the last 16 hours (covers a full work session)
  const rawCommits = git('git log --oneline --since="16 hours ago" --no-merges', root);
  const commits    = rawCommits ? rawCommits.split('\n').filter(Boolean) : [];

  // Files changed across those commits (vs the commit before them)
  const ancestor   = git(`git log --format="%H" --since="16 hours ago" --no-merges`, root)
    .split('\n').filter(Boolean).pop(); // oldest commit in range
  const diffStat   = ancestor
    ? git(`git diff ${ancestor}~1 HEAD --stat --no-color 2>/dev/null || git diff HEAD~1 --stat --no-color`, root)
    : git('git diff HEAD~1 --stat --no-color', root);

  // Short summary line: "8 files changed, 212 insertions(+), 34 deletions(-)"
  const shortStat  = ancestor
    ? git(`git diff ${ancestor}~1 HEAD --shortstat 2>/dev/null || git diff HEAD~1 --shortstat`, root)
    : git('git diff HEAD~1 --shortstat', root);

  // Uncommitted changes right now
  const status     = git('git status --short', root);

  // Changed file names only (for Gemini context, not shown to user)
  const changedFiles = git('git diff HEAD~1 --name-only 2>/dev/null', root)
    .split('\n').filter(Boolean).slice(0, 30); // cap at 30 files

  return { repoName, root, commits, diffStat, shortStat, status, changedFiles };
}

// ── Format git context for display ───────────────────────────────────────────
function displayGitContext(ctx) {
  console.log(`\n🔍  Git activity detected in: \x1b[36m${ctx.repoName}\x1b[0m`);

  if (ctx.commits.length) {
    console.log(`    📌  ${ctx.commits.length} commit${ctx.commits.length > 1 ? 's' : ''} this session:`);
    ctx.commits.slice(0, 5).forEach(c => {
      // Strip the hash prefix (first 7 chars + space)
      console.log(`       • ${c.slice(8)}`);
    });
    if (ctx.commits.length > 5) console.log(`       … and ${ctx.commits.length - 5} more`);
  }

  if (ctx.shortStat) {
    console.log(`    📊  ${ctx.shortStat.trim()}`);
  }

  if (ctx.status) {
    const unstaged = ctx.status.split('\n').filter(Boolean).length;
    console.log(`    ✏️   ${unstaged} file${unstaged > 1 ? 's' : ''} with uncommitted changes`);
  }

  if (!ctx.commits.length && !ctx.status) {
    console.log('    (no commits or changes detected in the last 16 hours)');
  }
}

// ── Format git context for Gemini prompt ─────────────────────────────────────
function gitContextForPrompt(ctx) {
  if (!ctx) return 'No git repository detected.';

  const lines = [`Repository: ${ctx.repoName}`];

  if (ctx.commits.length) {
    lines.push(`Commits this session (${ctx.commits.length}):`);
    ctx.commits.slice(0, 10).forEach(c => lines.push(`  - ${c.slice(8)}`));
  }

  if (ctx.changedFiles.length) {
    lines.push(`Files changed: ${ctx.changedFiles.join(', ')}`);
  }

  if (ctx.shortStat) {
    lines.push(`Change size: ${ctx.shortStat.trim()}`);
  }

  if (ctx.status) {
    lines.push(`Uncommitted changes:\n${ctx.status}`);
  }

  return lines.join('\n');
}

// ── Read journey-data.js ──────────────────────────────────────────────────────
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('\n❌  journey-data.js not found. Run from the vscode-journey folder.\n');
    process.exit(1);
  }
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(DATA_FILE, 'utf8'), ctx);
  return ctx.JOURNEY_DATA;
}

// ── Write journey-data.js ─────────────────────────────────────────────────────
function saveData(data) {
  fs.writeFileSync(DATA_FILE,
`// ─────────────────────────────────────────────────────────────────────────────
//  VS Code Journey — Your Data File
//  Edit this file manually or use: node log-session.js
// ─────────────────────────────────────────────────────────────────────────────

const JOURNEY_DATA = ${JSON.stringify(data, null, 2)};
`, 'utf8');
}

// ── Gemini API ────────────────────────────────────────────────────────────────
function callGemini(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(JSON.parse(parsed.candidates[0].content.parts[0].text));
        } catch {
          reject(new Error('Could not parse Gemini response: ' + raw.slice(0, 300)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Readline helper ───────────────────────────────────────────────────────────
function ask(rl, q) {
  return new Promise(r => rl.question(q, a => r(a.trim())));
}

// ── Progress bump (slows as skill advances) ───────────────────────────────────
function calcBump(p) {
  if (p >= 90) return 0.3;
  if (p >= 70) return 0.7;
  if (p >= 50) return 1.2;
  return 2.0;
}

// ── Setup wizard ──────────────────────────────────────────────────────────────
async function runSetup() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('\n' + '─'.repeat(50));
  console.log('  VS Code Journey — First-Time Setup');
  console.log('─'.repeat(50));
  console.log('\nYou need a free Google Gemini API key.\n');
  console.log('  1. Go to  →  https://aistudio.google.com/app/apikey');
  console.log('  2. Sign in with your Google account');
  console.log('  3. Click "Create API key"');
  console.log('  4. Paste it below\n');
  const key = await ask(rl, 'Paste your Gemini API key: ');
  rl.close();
  if (!key) { console.log('\nCancelled.\n'); return; }
  fs.writeFileSync(ENV_FILE, `GEMINI_API_KEY=${key}\n`, 'utf8');
  console.log('\n✅  API key saved to .env');
  console.log('\nYou\'re all set! Now run:\n\n    node log-session.js\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  if (process.argv.includes('--setup')) { await runSetup(); return; }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('\n❌  No Gemini API key found.');
    console.log('    Run:  node log-session.js --setup\n');
    process.exit(1);
  }

  const projectDir = getProjectDir();
  const data       = loadData();
  const gitCtx     = getGitContext(projectDir);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n' + '─'.repeat(50));
  console.log('  VS Code Journey — Log a Session');
  console.log('─'.repeat(50));

  // Show git context if found
  if (gitCtx) {
    displayGitContext(gitCtx);
  } else {
    console.log('\n  ℹ️   No git repo found in: ' + projectDir);
    console.log('      Tip: run with --project to point to your project folder.');
  }

  // If git has activity, description is optional
  const hasGitActivity = gitCtx && (gitCtx.commits.length > 0 || gitCtx.status);
  const descPrompt = hasGitActivity
    ? '\n📝  Add context (optional — git data above will be used if empty):\n    > '
    : '\n📝  What did you work on today?\n    > ';

  const description   = await ask(rl, descPrompt);
  const projectsInput = await ask(rl,
    gitCtx
      ? `\n📁  Project name (or Enter for "${gitCtx.repoName}"):\n    > `
      : '\n📁  Project name(s) (comma-separated, or Enter to skip):\n    > '
  );
  const newThingsInput = await ask(rl, '\n⚡  Any specific new things you learned? (optional):\n    > ');

  rl.close();

  // If no description and no git activity, bail
  if (!description && !hasGitActivity) {
    console.log('\nNothing to log. Session not saved.\n');
    return;
  }

  console.log('\n🤖  Analysing with Gemini...\n');

  const today      = new Date().toISOString().split('T')[0];
  const skillNames = data.skills.map(s => s.name);

  // Resolve project name
  const resolvedProject = projectsInput || (gitCtx ? gitCtx.repoName : '');

  const prompt =
`You are a developer journal assistant. Analyse this coding session using the git data and any additional context, then return structured JSON.

Available skills (use ONLY these exact names): ${skillNames.join(', ')}

--- GIT ACTIVITY (source of truth) ---
${gitContextForPrompt(gitCtx)}

--- ADDITIONAL CONTEXT FROM DEVELOPER ---
Description: "${description || 'none provided — use git activity above'}"
Projects: "${resolvedProject || 'use repo name from git'}"
New things learned: "${newThingsInput || 'infer from git activity'}"
Today's date: ${today}

Return ONLY valid JSON — no extra text, no markdown:
{
  "summary": "1-2 sentence summary (specific, developer-friendly — reference actual files or features changed if visible in git data)",
  "skills": ["matched skill names from available list only"],
  "projects": ["project names in Title Case"],
  "newThings": ["specific things learned or done for first time — empty array if nothing new"],
  "isMilestone": false,
  "milestoneTitle": "",
  "milestoneDescription": "",
  "milestoneIcon": ""
}

Rules:
- Prioritise git data over vague descriptions
- skills must ONLY come from the available skills list
- newThings must be specific (e.g. "Zod schema validation" not just "validation")
- isMilestone: true ONLY for genuinely significant firsts (first deploy, first API, first public repo, etc.)
- if isMilestone is true, fill all milestone fields with a fitting emoji in milestoneIcon`;

  try {
    const result = await callGemini(apiKey, prompt);

    const session = {
      date:      today,
      summary:   result.summary   || description || 'Session logged',
      skills:    result.skills    || [],
      projects:  result.projects  || (resolvedProject ? [resolvedProject] : []),
      newThings: result.newThings || []
    };

    data.sessions.unshift(session);
    data.profile.totalSessions = (data.profile.totalSessions || 0) + 1;

    for (const name of session.skills) {
      const skill = data.skills.find(s => s.name === name);
      if (skill) {
        skill.sessions = (skill.sessions || 0) + 1;
        skill.lastUsed = today;
        skill.progress = Math.min(99, Math.round((skill.progress + calcBump(skill.progress)) * 10) / 10);
      }
    }

    if (result.isMilestone && result.milestoneTitle) {
      data.milestones.push({
        date:        today,
        title:       result.milestoneTitle,
        description: result.milestoneDescription || '',
        icon:        result.milestoneIcon || '🏆'
      });
    }

    saveData(data);

    console.log('─'.repeat(50));
    console.log('✅  Session logged!\n');
    console.log(`  📋  Summary  : ${session.summary}`);
    console.log(`  🛠   Skills   : ${session.skills.length ? session.skills.join(', ') : 'none detected'}`);
    if (session.projects.length)  console.log(`  📁  Projects : ${session.projects.join(', ')}`);
    if (session.newThings.length) console.log(`  ⚡  Learned  : ${session.newThings.join(' · ')}`);
    if (result.isMilestone)       console.log(`  🏆  Milestone: ${result.milestoneTitle}`);
    if (gitCtx)                   console.log(`  🔀  Git repo : ${gitCtx.repoName} (${gitCtx.commits.length} commit${gitCtx.commits.length !== 1 ? 's' : ''} detected)`);
    console.log('\n  Open dashboard.html to see your updated progress.');
    console.log('─'.repeat(50) + '\n');

  } catch (err) {
    console.error('\n❌  Gemini API error:', err.message);
    console.log('    Check your API key or run:  node log-session.js --setup\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message, '\n');
  process.exit(1);
});
