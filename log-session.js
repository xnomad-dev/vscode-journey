#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  VS Code Journey — Session Logger
//  Uses Google Gemini free API to log your coding sessions automatically.
//
//  First time? Run:  node log-session.js --setup
//  Log a session:    node log-session.js
// ─────────────────────────────────────────────────────────────────────────────

const readline = require('readline');
const https    = require('https');
const fs       = require('fs');
const path     = require('path');
const vm       = require('vm');

const DATA_FILE = path.join(__dirname, 'journey-data.js');
const ENV_FILE  = path.join(__dirname, '.env');

// ── .env loader (no dependencies needed) ─────────────────────────────────────
function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  fs.readFileSync(ENV_FILE, 'utf8').split('\n').forEach(line => {
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.slice(0, eqIndex).trim();
      const val = line.slice(eqIndex + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  });
}

// ── Read journey-data.js ──────────────────────────────────────────────────────
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('\n❌  journey-data.js not found. Make sure you are running this from the project folder.\n');
    process.exit(1);
  }
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return ctx.JOURNEY_DATA;
}

// ── Write journey-data.js ─────────────────────────────────────────────────────
function saveData(data) {
  const content =
`// ─────────────────────────────────────────────────────────────────────────────
//  VS Code Journey — Your Data File
//  Edit this file manually or use: node log-session.js
// ─────────────────────────────────────────────────────────────────────────────

const JOURNEY_DATA = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(DATA_FILE, content, 'utf8');
}

// ── Gemini API call ───────────────────────────────────────────────────────────
function callGemini(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const text = parsed.candidates[0].content.parts[0].text;
          resolve(JSON.parse(text));
        } catch (e) {
          reject(new Error('Could not parse Gemini response. Raw: ' + raw.slice(0, 200)));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Readline helper ───────────────────────────────────────────────────────────
function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
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
  console.log('  4. Copy it and paste below\n');

  const key = await ask(rl, 'Paste your Gemini API key: ');
  rl.close();

  if (!key) {
    console.log('\nNo key entered. Setup cancelled.\n');
    return;
  }

  fs.writeFileSync(ENV_FILE, `GEMINI_API_KEY=${key}\n`, 'utf8');
  console.log('\n✅  API key saved to .env');
  console.log('\nYou\'re all set! Now run:\n\n    node log-session.js\n');
}

// ── Progress bump (slows as skill advances) ───────────────────────────────────
function calcProgressBump(current) {
  if (current >= 90) return 0.3;
  if (current >= 70) return 0.7;
  if (current >= 50) return 1.2;
  return 2.0;
}

// ── Main logger ───────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  if (process.argv.includes('--setup')) {
    await runSetup();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('\n❌  No Gemini API key found.');
    console.log('    Run setup first:  node log-session.js --setup\n');
    process.exit(1);
  }

  const data = loadData();
  const rl   = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n' + '─'.repeat(50));
  console.log('  VS Code Journey — Log a Session');
  console.log('─'.repeat(50) + '\n');

  const description = await ask(rl, '📝  What did you work on today?\n    > ');
  if (!description) {
    console.log('\nNothing entered. Session not logged.\n');
    rl.close();
    return;
  }

  const projectsInput  = await ask(rl, '\n📁  Project name(s) (comma-separated, or Enter to skip):\n    > ');
  const newThingsInput = await ask(rl, '\n⚡  Any specific new things you learned? (optional):\n    > ');

  rl.close();

  console.log('\n🤖  Analysing with Gemini...\n');

  const today      = new Date().toISOString().split('T')[0];
  const skillNames = data.skills.map(s => s.name);

  const prompt = `You are a developer journal assistant. Analyse this coding session and return structured JSON.

Available skills (use ONLY these exact names): ${skillNames.join(', ')}

Session description: "${description}"
Projects the user mentioned: "${projectsInput || 'not specified'}"
New things the user mentioned: "${newThingsInput || 'not specified'}"
Today's date: ${today}

Return ONLY valid JSON — no extra text, no markdown:
{
  "summary": "1-2 sentence summary (clear, specific, developer-friendly tone)",
  "skills": ["array of matched skill names from the available list only"],
  "projects": ["array of project names, cleaned up in Title Case"],
  "newThings": ["specific things learned or done for the first time — empty array if nothing new"],
  "isMilestone": false,
  "milestoneTitle": "",
  "milestoneDescription": "",
  "milestoneIcon": ""
}

Rules:
- skills must ONLY come from the available skills list
- newThings should be specific (e.g. "JWT token authentication" not just "authentication")
- isMilestone: true only for genuinely significant firsts (first deployment, first API, first test suite, first open-source publish, etc.)
- if isMilestone is true, fill all milestone fields and pick a fitting emoji for milestoneIcon`;

  try {
    const result = await callGemini(apiKey, prompt);

    // Build session entry
    const session = {
      date:      today,
      summary:   result.summary   || description,
      skills:    result.skills    || [],
      projects:  result.projects  || [],
      newThings: result.newThings || []
    };

    // Prepend to sessions (most recent first)
    data.sessions.unshift(session);
    data.profile.totalSessions = (data.profile.totalSessions || 0) + 1;

    // Update skill stats
    for (const skillName of session.skills) {
      const skill = data.skills.find(s => s.name === skillName);
      if (skill) {
        skill.sessions  = (skill.sessions || 0) + 1;
        skill.lastUsed  = today;
        skill.progress  = Math.min(99, Math.round((skill.progress + calcProgressBump(skill.progress)) * 10) / 10);
      }
    }

    // Add milestone if flagged
    if (result.isMilestone && result.milestoneTitle) {
      data.milestones.push({
        date:        today,
        title:       result.milestoneTitle,
        description: result.milestoneDescription || '',
        icon:        result.milestoneIcon || '🏆'
      });
    }

    saveData(data);

    // Print summary
    console.log('─'.repeat(50));
    console.log('✅  Session logged!\n');
    console.log(`  📋  Summary  : ${session.summary}`);
    console.log(`  🛠   Skills   : ${session.skills.length ? session.skills.join(', ') : 'none detected'}`);
    if (session.projects.length)  console.log(`  📁  Projects : ${session.projects.join(', ')}`);
    if (session.newThings.length) console.log(`  ⚡  Learned  : ${session.newThings.join(' · ')}`);
    if (result.isMilestone)       console.log(`  🏆  Milestone: ${result.milestoneTitle}`);
    console.log('\n  Open dashboard.html to see your updated progress.');
    console.log('─'.repeat(50) + '\n');

  } catch (err) {
    console.error('\n❌  Error calling Gemini API:', err.message);
    console.log('    Double-check your API key in .env or run setup again:\n');
    console.log('    node log-session.js --setup\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌  Unexpected error:', err.message, '\n');
  process.exit(1);
});
