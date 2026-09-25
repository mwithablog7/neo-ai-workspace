# NEO

**NEO turns messy thoughts into clear next actions.**

NEO is a personal AI workspace for students, creators, and early-career marketers. Type a real problem, question, idea, or goal — NEO returns a structured, actionable answer in four parts:

- **What I'm seeing** — a short interpretation of the problem
- **What to check** — three concrete things to investigate
- **Next action** — one move you can make now, with a timebox
- **Why** — the reasoning behind it

It is a **working prototype**, not a mockup: every input produces a response, quick actions reshape the workspace, project selection changes context, and the analytics view renders real charts from sample data.

## No API keys. No login. No network.

NEO's responses come from a local rules engine (`src/engine/neoEngine.js`). It classifies input by **topic** (9 domains: social, marketing, content, academic, career, planning, launch, data, general) and by **intent** (Ask / Analyze / Plan / Create), then composes a domain-specific structured answer. Deterministic per input, varied across inputs — it works the instant anyone opens it, offline, with zero configuration.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed URL (default `http://127.0.0.1:5173`).

## Build

```bash
npm run build     # outputs static site to dist/
npm run preview   # serve the production build locally
```

The build uses relative asset paths (`base: './'`), so `dist/` works from any static host or subpath.

## Deployment information

The prototype is published with **GitHub Pages** using a GitHub Actions workflow:

- **Live URL:** https://mwithablog7.github.io/neo-ai-workspace/
- **Repository:** https://github.com/mwithablog7/neo-ai-workspace
- **Workflow:** `.github/workflows/deploy.yml` — on every push to `main` it runs `npm ci` → `npm run build` → uploads `dist/` as a Pages artifact → deploys with `actions/deploy-pages`.

Pages is configured with `build_type: workflow`, so no branch-pushing of build output is needed and `dist/` is never committed. To redeploy, push to `main`; the run completes in under a minute and the site updates after the run finishes (browsers may cache the HTML shell for a few minutes — append `?v=2` to the URL to bypass).

Any static host works unchanged because assets use relative paths: build with `npm run build`, then serve `dist/`.

## Structure

```
neo-ai-workspace/
├── index.html                 # HTML shell, meta, local SVG favicon
├── vite.config.js             # Vite + React, relative base for portable deploys
├── public/
│   └── favicon.svg            # NEO mark (local asset, no external URLs)
└── src/
    ├── main.jsx               # entry
    ├── App.jsx                # state, navigation, the three views
    ├── engine/
    │   └── neoEngine.js       # local response engine: validation, topic/mode
    │                          # classification, structured answer composition
    ├── data/
    │   ├── projects.js        # 3 generic demo projects (goal, context, activity,
    │   │                      #   next actions) + dashboard recent-activity feed
    │   └── analytics.js       # 8 weeks of demo metrics + NEO Insight copy
    ├── components/
    │   ├── Logo.jsx           # NEO wordmark (inline SVG)
    │   ├── icons.jsx          # stroke icon set (inline SVG)
    │   ├── Composer.jsx       # input, quick actions, validation, submit
    │   ├── ResponseCard.jsx   # the 4-section structured response
    │   ├── ProjectCard.jsx    # selectable project card
    │   └── ReachChart.jsx     # responsive reach + engagement chart
    └── styles/
        ├── tokens.css         # design tokens: dark palette, single accent
        ├── base.css           # reset, typography, shell, nav, footer
        ├── components.css     # buttons, composer, response, cards
        └── views.css          # hero, context, stats, chart, insight
```

## Features

| Area | What works |
|---|---|
| **Dashboard** | Logo, welcome, hero input above the fold, 4 quick actions, helper copy, projects, recent activity feed, demo analytics preview |
| **NEO workspace** | Real input → structured response, adapted to keywords, intent, and active project. Follow-up chips, example prompts |
| **Quick actions** | Ask NEO / Analyze / Plan / Create — each sets the mode, updates the placeholder, and pre-fills a project-aware starter prompt |
| **Projects** | 3 generic demo projects (Marketing Campaign, Content Strategy, University Project); selecting one updates the card, context panel, “Working in: …” indicator, and future responses. Each shows goal, context, recent activity, and relevant next actions |
| **Analytics** | Clearly-labelled demo data: reach, engagement rate, followers, content published; bar + line chart; NEO insight; accessible data table |
| **Navigation** | Home / Projects / Analytics — desktop nav, mobile bottom tab bar, URL hash sync, browser back/forward |
| **Error handling** | Empty input, symbol/number-only input, 600-char cap, double-submit guard — all handled with accessible messages, never raw errors |

## Accessibility

Semantic HTML · labelled controls · skip link · `role="alert"` errors · `aria-invalid` / `aria-describedby` · `aria-pressed` on quick actions · `aria-current` on nav · visible 2px accent focus outlines · AA text contrast · 44px+ tap targets · keyboard operable throughout · `prefers-reduced-motion` respected · chart data available as a table.

## Performance

No external fonts, images, APIs, or analytics. Hand-rolled chart (no chart library). Production payload: **~63 KB gzipped JS + ~5 KB gzipped CSS**. First paint needs zero network requests beyond the two bundle files.

## Demo data

All projects, recent activity, and analytics are **sample demo data**, labelled as such in the UI. The demo projects are intentionally generic (Marketing Campaign, Content Strategy, University Project) — no personal brands, real clients, or identifying information. NEO is a prototype: nothing here connects to a live account or external service.

## Tech

React 18 · Vite 6 · plain modern CSS. Two runtime dependencies total (`react`, `react-dom`).
