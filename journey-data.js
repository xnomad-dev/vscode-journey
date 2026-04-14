// ─────────────────────────────────────────────────────────────────────────────
//  VS Code Journey — Your Data File
//  Edit this file to reflect your own journey.
//  Then open dashboard.html in your browser to see your progress.
// ─────────────────────────────────────────────────────────────────────────────

const JOURNEY_DATA = {

  // ── Profile ─────────────────────────────────────────────────────────────────
  profile: {
    name: "Alex",                  // Your name (shown in the header)
    startDate: "2025-12-01",       // When you started your VS Code journey
    totalSessions: 24              // Total number of coding sessions logged
  },

  // ── Skills ──────────────────────────────────────────────────────────────────
  // progress: 0–33 = Beginner, 34–66 = Intermediate, 67–100 = Advanced
  // category options: Language, Framework, DevOps, Backend, Frontend, AI/ML, Automation, Database, Testing
  skills: [
    { name: "Python",            icon: "🐍", progress: 72, sessions: 18, lastUsed: "2026-04-10", category: "Language"   },
    { name: "HTML/CSS/JS",       icon: "🌐", progress: 65, sessions: 14, lastUsed: "2026-04-08", category: "Language"   },
    { name: "Git & GitHub",      icon: "🔀", progress: 58, sessions: 16, lastUsed: "2026-04-10", category: "DevOps"     },
    { name: "APIs & Integration",icon: "🔌", progress: 55, sessions: 11, lastUsed: "2026-04-10", category: "Backend"    },
    { name: "Debugging",         icon: "🐛", progress: 62, sessions: 13, lastUsed: "2026-04-10", category: "Language"   },
    { name: "React",             icon: "⚛️", progress: 40, sessions:  7, lastUsed: "2026-04-05", category: "Framework"  },
    { name: "Node.js",           icon: "🟩", progress: 38, sessions:  6, lastUsed: "2026-04-05", category: "Backend"    },
    { name: "Deployment",        icon: "🚀", progress: 48, sessions:  8, lastUsed: "2026-04-10", category: "DevOps"     },
    { name: "SQL & Databases",   icon: "🗄️", progress: 32, sessions:  5, lastUsed: "2026-03-28", category: "Database"   },
    { name: "TypeScript",        icon: "🔷", progress: 28, sessions:  4, lastUsed: "2026-04-05", category: "Language"   },
    { name: "Docker",            icon: "🐳", progress: 22, sessions:  3, lastUsed: "2026-03-15", category: "DevOps"     },
    { name: "Testing",           icon: "🧪", progress: 30, sessions:  4, lastUsed: "2026-03-22", category: "Testing"    }
  ],

  // ── Projects ─────────────────────────────────────────────────────────────────
  // status options: live, progress, review, paused, planning
  projects: [
    {
      name: "Personal Portfolio",
      status: "live",
      description: "Responsive portfolio site built from scratch — HTML/CSS/JS with dark mode toggle and contact form.",
      sessions: 5,
      startDate: "2025-12-05",
      lastActive: "2025-12-28",
      tech: ["HTML/CSS/JS", "Git & GitHub", "Deployment"]
    },
    {
      name: "Weather Dashboard",
      status: "live",
      description: "React app pulling live weather data from OpenWeatherMap API. Shows 5-day forecast with charts.",
      sessions: 6,
      startDate: "2026-01-10",
      lastActive: "2026-01-30",
      tech: ["React", "APIs & Integration", "HTML/CSS/JS"]
    },
    {
      name: "Task Manager API",
      status: "live",
      description: "REST API with Node.js + Express + SQLite. Full CRUD, JWT auth, deployed on Railway.",
      sessions: 7,
      startDate: "2026-02-05",
      lastActive: "2026-02-28",
      tech: ["Node.js", "SQL & Databases", "Deployment", "APIs & Integration"]
    },
    {
      name: "Blog Scraper",
      status: "live",
      description: "Python scraper that collects articles from 10 tech blogs, stores in SQLite, exports to CSV/JSON.",
      sessions: 4,
      startDate: "2026-03-01",
      lastActive: "2026-03-12",
      tech: ["Python", "SQL & Databases", "APIs & Integration"]
    },
    {
      name: "URL Shortener",
      status: "live",
      description: "Flask web app with custom short links, click analytics, and a simple admin dashboard.",
      sessions: 3,
      startDate: "2026-03-20",
      lastActive: "2026-03-28",
      tech: ["Python", "SQL & Databases", "Deployment"]
    },
    {
      name: "Expense Tracker",
      status: "progress",
      description: "Full-stack app with React frontend and Node.js API. Charts, categories, monthly summaries. Almost done.",
      sessions: 6,
      startDate: "2026-04-01",
      lastActive: "2026-04-10",
      tech: ["React", "Node.js", "TypeScript", "SQL & Databases"]
    },
    {
      name: "Discord Bot",
      status: "paused",
      description: "Python bot with moderation commands and music playback. Paused to learn async patterns first.",
      sessions: 2,
      startDate: "2026-03-14",
      lastActive: "2026-03-16",
      tech: ["Python", "APIs & Integration"]
    },
    {
      name: "E-Commerce Site",
      status: "planning",
      description: "Full-stack store with React, Node.js, Stripe payments, and admin panel. Planning phase.",
      sessions: 0,
      startDate: "2026-04-12",
      lastActive: "2026-04-12",
      tech: ["React", "Node.js", "TypeScript", "SQL & Databases"]
    }
  ],

  // ── Sessions ─────────────────────────────────────────────────────────────────
  // Add a new entry at the TOP of this array after each coding session.
  sessions: [
    {
      date: "2026-04-10",
      summary: "Added TypeScript to the Expense Tracker frontend — migrated components and fixed type errors. Feels much safer than plain JS.",
      skills: ["React", "TypeScript", "Debugging"],
      projects: ["Expense Tracker"],
      newThings: ["TypeScript generics in React props", "Strict null checks", "Type narrowing with typeof"]
    },
    {
      date: "2026-04-05",
      summary: "Wired up the Expense Tracker API to the React frontend. Charts working, categories filtering correctly. Fixed a CORS issue that took 2 hours to track down.",
      skills: ["React", "Node.js", "APIs & Integration", "Debugging"],
      projects: ["Expense Tracker"],
      newThings: ["CORS preflight requests", "Axios interceptors for auth headers"]
    },
    {
      date: "2026-04-01",
      summary: "Started the Expense Tracker project — scaffolded React frontend with Vite, set up Node.js/Express backend, designed the database schema.",
      skills: ["React", "Node.js", "SQL & Databases", "TypeScript"],
      projects: ["Expense Tracker"],
      newThings: ["Vite as a React build tool", "Designing relational schemas upfront"]
    },
    {
      date: "2026-03-28",
      summary: "Built the URL Shortener — Flask + SQLite, deployed to Render. First time setting up a custom domain for a project.",
      skills: ["Python", "SQL & Databases", "Deployment"],
      projects: ["URL Shortener"],
      newThings: ["Render free tier deployment", "Setting up custom domain with DNS records", "Base62 encoding for short codes"]
    },
    {
      date: "2026-03-22",
      summary: "Wrote unit tests for the Task Manager API using Jest. Learned about mocking database calls. Coverage at 78%.",
      skills: ["Node.js", "Testing", "Debugging"],
      projects: ["Task Manager API"],
      newThings: ["Jest mock functions", "Test coverage reports", "Supertest for API endpoint testing"]
    },
    {
      date: "2026-03-15",
      summary: "Explored Docker — containerized the Blog Scraper. Wrote a Dockerfile and docker-compose.yml. Got it running, but still shaky on networking.",
      skills: ["Docker", "Python"],
      projects: ["Blog Scraper"],
      newThings: ["Writing a Dockerfile", "docker-compose.yml basics", "Volume mounting for persistent data"]
    },
    {
      date: "2026-03-12",
      summary: "Finished Blog Scraper — all 10 sources working, data cleaned and normalized, CSV/JSON export ready. First serious scraping project.",
      skills: ["Python", "SQL & Databases", "Debugging"],
      projects: ["Blog Scraper"],
      newThings: ["BeautifulSoup vs Playwright trade-offs", "Rate limiting scrapers to avoid blocks", "Data normalization across sources"]
    },
    {
      date: "2026-03-01",
      summary: "Started the Blog Scraper project. Set up BeautifulSoup, scraped 3 sources, stored in SQLite. Hit rate limiting issues on one site.",
      skills: ["Python", "SQL & Databases", "APIs & Integration"],
      projects: ["Blog Scraper"],
      newThings: ["BeautifulSoup HTML parsing", "SQLite with Python sqlite3 module", "Handling HTTP 429 errors"]
    },
    {
      date: "2026-02-28",
      summary: "Deployed Task Manager API to Railway with a PostgreSQL database. Switched from SQLite to Postgres for production. JWT auth fully working.",
      skills: ["Node.js", "SQL & Databases", "Deployment", "APIs & Integration"],
      projects: ["Task Manager API"],
      newThings: ["Railway deployment pipeline", "PostgreSQL vs SQLite differences", "Environment variables in production"]
    },
    {
      date: "2026-02-15",
      summary: "Added JWT authentication to the Task Manager API. Register, login, protected routes. Took a full day but finally clicked.",
      skills: ["Node.js", "APIs & Integration", "Debugging"],
      projects: ["Task Manager API"],
      newThings: ["JWT token structure (header.payload.signature)", "bcrypt password hashing", "Express middleware for auth"]
    },
    {
      date: "2026-02-05",
      summary: "Started Task Manager API — Node.js + Express, SQLite, full CRUD for tasks. First time building a backend from scratch solo.",
      skills: ["Node.js", "SQL & Databases", "APIs & Integration"],
      projects: ["Task Manager API"],
      newThings: ["Express routing and middleware", "SQLite with better-sqlite3", "REST API conventions (HTTP verbs + status codes)"]
    },
    {
      date: "2026-01-30",
      summary: "Finished Weather Dashboard — added 5-day forecast, wind/humidity cards, and a chart using Chart.js. Deployed to GitHub Pages.",
      skills: ["React", "APIs & Integration", "Deployment", "Debugging"],
      projects: ["Weather Dashboard"],
      newThings: ["Chart.js integration with React", "GitHub Pages deployment for React apps", "OpenWeatherMap API pagination"]
    },
    {
      date: "2026-01-18",
      summary: "Built the core Weather Dashboard — API calls working, current weather displaying. Struggling with React state and re-renders.",
      skills: ["React", "APIs & Integration", "HTML/CSS/JS"],
      projects: ["Weather Dashboard"],
      newThings: ["useEffect dependencies array", "Async/await inside useEffect", "React loading/error states"]
    },
    {
      date: "2026-01-10",
      summary: "Started learning React — built a counter, a todo list, and a basic form. State and props starting to make sense.",
      skills: ["React", "HTML/CSS/JS"],
      projects: ["Weather Dashboard"],
      newThings: ["useState hook", "Props passing between components", "JSX syntax", "React component lifecycle"]
    },
    {
      date: "2025-12-28",
      summary: "Polished the portfolio — mobile responsive, added project cards, pushed to GitHub and deployed via Netlify. First live project!",
      skills: ["HTML/CSS/JS", "Git & GitHub", "Deployment"],
      projects: ["Personal Portfolio"],
      newThings: ["Netlify drag-and-drop deployment", "CSS Grid for responsive layouts", "Git branching and merging"]
    },
    {
      date: "2025-12-15",
      summary: "Built the portfolio structure — navbar, hero section, about, skills grid. First time writing CSS Grid from scratch.",
      skills: ["HTML/CSS/JS", "Debugging"],
      projects: ["Personal Portfolio"],
      newThings: ["CSS Grid template areas", "CSS custom properties (variables)", "Dark mode with prefers-color-scheme"]
    },
    {
      date: "2025-12-10",
      summary: "Learned Git basics — init, add, commit, push. Set up GitHub, created first repo. Also learned about .gitignore.",
      skills: ["Git & GitHub"],
      projects: ["Personal Portfolio"],
      newThings: ["git init / add / commit / push", "Creating a GitHub repository", ".gitignore patterns", "SSH keys for GitHub"]
    },
    {
      date: "2025-12-05",
      summary: "Opened VS Code for real. Installed extensions (Prettier, ESLint, GitLens). Built first HTML page — a simple about-me.",
      skills: ["HTML/CSS/JS"],
      projects: ["Personal Portfolio"],
      newThings: ["VS Code extensions marketplace", "Prettier auto-formatting", "Live Server extension", "Basic HTML boilerplate"]
    },
    {
      date: "2025-12-01",
      summary: "Day 1 — installed VS Code, set up the terminal, and wrote Hello World in Python and JavaScript. The journey begins.",
      skills: ["Python", "HTML/CSS/JS"],
      projects: [],
      newThings: ["VS Code installation and setup", "Integrated terminal usage", "Running Python scripts from terminal", "Hello World in two languages"]
    }
  ],

  // ── Milestones ────────────────────────────────────────────────────────────────
  milestones: [
    { date: "2025-12-01", title: "Day One",               description: "Opened VS Code for the first time and wrote Hello World",              icon: "🎯" },
    { date: "2025-12-10", title: "First Git Commit",      description: "Set up GitHub and pushed first repository",                            icon: "🔀" },
    { date: "2025-12-28", title: "First Live Project",    description: "Personal portfolio deployed to Netlify — live on the internet",        icon: "🚀" },
    { date: "2026-01-10", title: "Started React",         description: "Took the leap into component-based UI with React",                     icon: "⚛️" },
    { date: "2026-01-30", title: "First React App Live",  description: "Weather Dashboard deployed to GitHub Pages",                           icon: "🌤️" },
    { date: "2026-02-05", title: "First Backend API",     description: "Built a REST API with Node.js and Express from scratch",               icon: "🔌" },
    { date: "2026-02-28", title: "First Cloud Deployment",description: "Task Manager API live on Railway with a real PostgreSQL database",     icon: "☁️" },
    { date: "2026-03-15", title: "First Docker Container",description: "Containerized the Blog Scraper with Docker",                          icon: "🐳" },
    { date: "2026-03-22", title: "First Tests Written",   description: "Added Jest unit tests to Task Manager API — 78% coverage",            icon: "🧪" },
    { date: "2026-04-01", title: "First TypeScript",      description: "Started using TypeScript in the Expense Tracker project",             icon: "🔷" }
  ]

};
