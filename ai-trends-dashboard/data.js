// Seed data for the dashboard, curated from web research on 2026-07-03.
// The "vendor tips" section is sourced entirely from vendors' own public
// changelogs/blogs (Anthropic, GitHub, etc.) — zero API cost, no X/Twitter
// dependency. To go live: replace the static objects below with fetch()
// calls to those changelog pages/RSS feeds. Each render*() function in
// script.js only needs an array/object shaped like these.

const DASHBOARD_DATA = {
  updated: "2026-07-15",
  mode: "official sources only · zero API cost", // swap to "live" once fetches are wired in

  stats: [
    {
      value: "90",
      unit: "%",
      label: "developers using an AI coding tool at work",
      delta: "▲ from 84% (Stack Overflow, 2025)",
      source: "JetBrains, Jan 2026",
    },
    {
      value: "$12.8",
      unit: "B",
      label: "AI coding tools market size, 2026",
      delta: "▲ from $5.1B in 2024",
      source: "Industry estimate",
    },
    {
      value: "18",
      unit: "%",
      label: "of developers use Claude Code at work",
      delta: "▲ 6× since Apr–Jun 2025",
      source: "JetBrains, Jan 2026",
    },
    {
      value: "$2.5",
      unit: "B",
      label: "Claude Code run-rate revenue, reached in 9 months",
      delta: "fastest-growing dev product on record",
      source: "Anthropic reporting",
    },
  ],

  claudeAdoptionSeries: [
    { label: "Apr–Jun '25", value: 3 },
    { label: "Sep '25", value: 12 },
    { label: "Jan '26", value: 18 },
  ],

  toolAdoptionBars: [
    { name: "GitHub Copilot", value: 29, color: "var(--cat-copilot)", note: "26M+ total users" },
    { name: "Cursor", value: 18, color: "var(--cat-cursor)", note: "fastest-growing SaaS on record" },
    { name: "Claude Code", value: 18, color: "var(--cat-claude)", note: "tied with Cursor" },
  ],

  bestPractices: [
    {
      title: "Generate CLAUDE.md with /init",
      desc: "Gives Claude persistent project context — commands, conventions, workflow rules — it can't reliably infer from code alone.",
    },
    {
      title: "Keep CLAUDE.md under ~200 lines",
      desc: "Every line is re-read on every turn and costs context budget. Trim it like you'd trim a config file, not a wiki.",
    },
    {
      title: "Point it at CLI tools, not custom scripts",
      desc: "gh, aws, gcloud, sentry-cli, etc. are the most context-efficient way for Claude to touch external services.",
    },
    {
      title: "Get a fresh reviewer for its own work",
      desc: "A session that wrote the code is anchored to its implementation path. A clean context reviews more skeptically.",
    },
    {
      title: "Use /loop for test-fix cycles",
      desc: "Runs tests, refactors, and re-runs automatically until green — no manual confirmation on every step.",
    },
    {
      title: "Install skills from the marketplace",
      desc: "Reusable slash commands now exist for code review, security testing, diagramming, and browser automation.",
    },
  ],

  vendorTips: {
    windowLabel: "Straight from the changelogs — checked periodically, a few days' lag is fine",
    items: [
      {
        vendor: "GitHub · Copilot",
        when: "Jul 20, 2026",
        tip: "GitHub Code Quality becomes a paid product at $10 per active committer/month. Check your org's active-committer count now (visible under Code Quality settings) to estimate the bill before it flips on.",
      },
      {
        vendor: "GitHub · Copilot",
        when: "Jul 2026",
        tip: "GPT-5.6 is rolling into Copilot's model picker in three variants — Sol, Terra, Luna — so you can match the model to the job: deep reasoning over a large codebase, everyday agentic coding, or fast/cheap assistance.",
      },
      {
        vendor: "GitHub · Copilot",
        when: "Jul 1, 2026",
        tip: "Kimi K2.7 Code joined the model picker as the first open-weight model offered as a selectable option, alongside VS Code browser tools reaching general availability and CLI Auto now routing requests by task.",
      },
      {
        vendor: "Anthropic · Claude",
        when: "Jul 1, 2026",
        tip: "Claude Fable 5 redeployed globally across Claude.ai, Claude Code, and Claude Cowork — included in up to 50% of weekly usage limits through Jul 7, now drawing from usage credits after that.",
      },
      {
        vendor: "Anthropic · Claude Code",
        when: "Jul 2026",
        tip: "Claude Sonnet 5 is now the default model, with a native 1M-token context window and promotional $2/$10-per-Mtok pricing through Aug 31 (then $3/$15) — worth switching a large-repo workflow over before the window closes.",
      },
      {
        vendor: "OpenAI",
        when: "Jul 2026",
        tip: "GPT-5.6 is becoming the new preferred model across Microsoft 365 Copilot — Word, Excel, PowerPoint, Chat, and Cowork.",
      },
    ],
    note: "Sourced entirely from vendors' own public changelogs and release notes (Anthropic, GitHub, OpenAI) — no X/Twitter API, no billing. Checked in batches rather than streamed live, so items can lag the actual release by a few days; that's an accepted trade-off for keeping this section free.",
  },

  comparison: [
    {
      name: "Claude Code",
      color: "var(--cat-claude)",
      adoption: "18%",
      model: "Agentic assistant for terminal, IDE, desktop and Slack — built for autonomous, multi-step tasks",
    },
    {
      name: "Cursor",
      color: "var(--cat-cursor)",
      adoption: "18%",
      model: "Full AI-native IDE (VS Code fork) — AI is part of every layer of editing, not bolted on",
    },
    {
      name: "GitHub Copilot",
      color: "var(--cat-copilot)",
      adoption: "29%",
      model: "AI pair programmer embedded across GitHub and most major IDEs — widest distribution",
    },
  ],

  sources: [
    { title: "Claude Code changelog — Claude Code Docs", url: "https://code.claude.com/docs/en/changelog" },
    { title: "Claude Platform release notes — Anthropic Docs", url: "https://docs.anthropic.com/en/release-notes/overview" },
    { title: "Newsroom — Anthropic", url: "https://www.anthropic.com/news" },
    { title: "Introducing Claude Sonnet 5 — Anthropic", url: "https://www.anthropic.com/news/claude-sonnet-5" },
    { title: "Redeploying Claude Fable 5 — Anthropic", url: "https://www.anthropic.com/news/redeploying-fable-5" },
    { title: "GitHub Copilot July 2026 update: Kimi K2.7, Browser, Credit Caps", url: "https://tokenmix.ai/blog/github-copilot-july-2026-update-kimi-browser-ai-credits" },
    { title: "GitHub Changelog, 06/2026", url: "https://github.blog/changelog/month/06-2026/" },
    { title: "Best practices for Claude Code — Claude Code Docs", url: "https://code.claude.com/docs/en/best-practices" },
    { title: "Which AI Coding Tools Do Developers Actually Use at Work? — JetBrains Blog", url: "https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/" },
    { title: "Claude Code vs Codex vs OpenCode — Medium", url: "https://medium.com/@unicodeveloper/claude-code-vs-codex-vs-opencode-which-ai-coding-agent-is-actually-the-best-in-2026-baa9f6fd5374" },
    { title: "CLAUDE.md Best Practices: The Complete 2026 Guide", url: "https://maketocreate.com/claude-md-best-practices-the-complete-2026-guide/" },
    { title: "Claude Code Best Practices: 15 Rules for Safer Agentic Coding", url: "https://diyai.io/ai-tools/code-generation/claude-code-best-practices/" },
    { title: "Claude Code: The Complete Guide and Best Practices for 2026 — Collabnix", url: "https://collabnix.com/claude-code-the-complete-guide-and-best-practices-for-ai-powered-development-in-2026/" },
    { title: "10 Claude Code Alternatives for AI-Powered Coding in 2026 — DigitalOcean", url: "https://www.digitalocean.com/resources/articles/claude-code-alternatives" },
    { title: "Claude Code vs GitHub Copilot vs Cursor (2026)", url: "https://www.cosmicjs.com/blog/claude-code-vs-github-copilot-vs-cursor-which-ai-coding-agent-should-you-use-2026" },
    { title: "Best AI Coding Assistants 2026 — Scrimba", url: "https://scrimba.com/articles/best-ai-coding-assistants-2026/" },
    { title: "GitHub Copilot Under Pressure: Cursor and Claude Code Are Eating Its Lunch (2026)", url: "https://pasqualepillitteri.it/en/news/3392/github-copilot-cursor-claude-code-ai-coding-showdown-2026" },
  ],
};
