# ZEITBRUCH — Time‑Bending Tower Defense for the Browser

> **Vertical Slice Goal:** 1 map • 6–8 waves • 8 towers • 8 enemies • **Rewind**, **Phase‑Shift**, **Epoch Overlay**, **Artifact Draft**  
> **Stack:** TypeScript • Vite • PNPM • (optional) Pixi.js/WebGL • Vitest • Playwright • GitHub Actions

![ZEITBRUCH](docs/hero-placeholder.png)
*(Placeholder — replace with an in‑game screenshot/GIF)*

![Status](https://img.shields.io/badge/status-WIP-orange) ![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blue) ![license](https://img.shields.io/badge/license-TBD-lightgrey)

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Data‑Driven Content](#data-driven-content)
- [Determinism Rules](#determinism-rules)
- [Time Mechanics](#time-mechanics)
- [Tests & Quality](#tests--quality)
- [Performance & Accessibility Targets](#performance--accessibility-targets)
- [Roadmap & Milestones](#roadmap--milestones)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Credits](#credits)
- [Contact](#contact)

---

## Overview
**ZEITBRUCH** is a tower defense about **mastering time**. Rewind the last seconds, shift enemy paths in real time, and overlay entire epochs to alter buffs and resistances. Every intervention fills a **Paradox Meter** — powerful, but risky.

This repository first targets a **Vertical Slice**, then expands toward Early Access with meta‑progression, telemetry, and a PWA release.

---

## Key Features
- 🔁 **Rewind** (≥ 6 s): Snapshot rollback every 100 ms without desync.
- 🔀 **Phase‑Shift**: Toggle path segments; deterministic re‑pathing.
- 🕰️ **Epoch Overlay**: Temporary epoch layer with map buffs/resists (10–15 s).
- ⚡ **Paradox Events**: At 100% trigger weighted, seeded events.
- 🧩 **Data‑Driven**: Towers, enemies, waves, artifacts in JSON with schemas.
- 🧪 **Testing**: Vitest (unit/property) and Playwright (E2E); CI via GitHub Actions.
- 📊 **Dev Telemetry**: Heatmaps, DPS/leaks, rewind usage, tower mix.
- 📱 **PWA & Mobile**: Responsive HUD, safe areas, offline vertical slice.

---

## Tech Stack
- **Core:** TypeScript, Vite (dev server & build)
- **Rendering:** Canvas 2D or WebGL (Pixi.js optional)
- **Architecture:** ECS (Entities/Components/Systems)
- **Audio:** WebAudio API
- **Testing:** Vitest (unit), Playwright (E2E)
- **CI/CD:** GitHub Actions (lint/test/build/preview)
- **Package Manager:** PNPM, Node ≥ 20 LTS

---

## Requirements
- **Node:** 20.x (LTS) — managed via `.nvmrc`
- **PNPM:** ≥ 9  
- **Browsers:** Latest Chrome/Edge/Firefox (WebGL recommended)

---

## Quick Start
```bash
# 1) Install deps
pnpm i

# 2) Run dev server
pnpm dev
# -> http://localhost:5173

# 3) Unit tests
pnpm test

# 4) Lint & typecheck
pnpm lint
pnpm typecheck

# 5) Build & preview
pnpm build
pnpm preview
```

Optional: **Playwright** install & run
```bash
pnpm dlx playwright install --with-deps
pnpm e2e
```

---

## Project Structure
```
/src
  /ecs            # Entity-Component-System
  /engine         # Loop, RNG, snapshots, determinism
  /path           # Tilemap, A*, phase-shift
  /combat         # Damage, projectiles, status effects
  /content        # JSON: towers, enemies, waves, artifacts (+schemas)
  /ui             # HUD, timeline, build UI, overlay wheel
  /audio          # Audio manager, SFX
  /scenes         # Boot, MainMenu, Map
  /maps           # Tiled JSON + overlays/relic nodes
  /meta           # Meta progression (factions, tech tree)
  /utils          # Helpers, types, logging
/tests            # Vitest suites
/e2e              # Playwright tests
/docs             # Screenshots, specs
```

**Aliases (`tsconfig.json`)**: `@ecs`, `@engine`, `@path`, `@combat`, `@content`, `@ui`, `@audio`, `@scenes`, `@maps`, `@utils`, `@meta`

---

## Scripts
```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "validate:content": "node scripts/validate-content.js"
  }
}
```

---

## Data‑Driven Content
- **Schemas:** `content/*.schema.json` — CI validates all content files.
- **Examples:** `content/examples/*` — reference values for tooltips & tests.
- **Waves:** `content/waves/*.json` — deterministic spawns via seed.
- **Maps:** `maps/*.json` — Tiled layout, path edges, overlay zones, relics.

Example tower (Railgun):
```json
{
  "id": "railgun",
  "era": "near_future",
  "tiers": [
    { "cost": 150, "range": 6.5, "cooldown": 1.8, "damage": 45, "pierce": 2 },
    { "cost": 220, "range": 7.2, "cooldown": 1.6, "damage": 60, "pierce": 3 },
    { "cost": 320, "range": 7.8, "cooldown": 1.4, "damage": 80, "pierce": 4 }
  ],
  "effects": ["line_pierce", "armor_shred_synergy"]
}
```

---

## Determinism Rules
**Definition of Done (excerpt):**
- Fixed **simulation step** (e.g., 60 Hz); rendering interpolates.
- Project RNG: `@engine/rng` (Xorshift128+). **No** `Math.random()` in sim code.
- Snapshot rewind: ring buffer (≥ 6 s, 100 ms) with deterministic replay.
- No wall‑clock in sim (`Date.now()` forbidden) — use ticks only.
- Re‑pathing during phase‑shift must be reproducible (same seed ⇒ same paths).
- Unit & property tests enforce determinism.

---

## Time Mechanics
- **Rewind:** Roll back positions/HP/status for the last seconds. Costs **Chrono Energy**, raises **Entropy** (balancing).
- **Phase‑Shift:** Activate/deactivate alternate path edges. Increases tower uptime, reduces **Stability**.
- **Epoch Overlay:** 10–15 s epoch layer with buffs/resists (e.g., Medieval → +range for Ballista).
- **Paradox:** Interventions fill the meter; at 100% a seeded event triggers (e.g., Dino stampede). Loot: **Anomaly Cores** (meta).

---

## Tests & Quality
- **Unit/Component:** Vitest (coverage target ≥ 90% for `/engine` & `/combat`).
- **Property test:** Same seed ⇒ same metrics checksum (determinism).
- **E2E:** Playwright (Boot → Level → Rewind/Phase‑Shift/Overlay scenarios).
- **CI:** Lint, test, build, preview artifact/pages.

PR checklist:
- [ ] All tests green (unit/E2E), coverage OK  
- [ ] No non‑deterministic APIs in sim code  
- [ ] JSON content validated (schemas)  
- [ ] README/Docs updated  
- [ ] Demo scene or GIF included for the feature

---

## Performance & Accessibility Targets
- **Desktop performance:** 60 FPS @ 500+ entities; stable frametime (< 4 ms stutter).
- **Mobile:** ≥ 50 FPS on mid‑range Android; adaptive quality tiers.
- **Accessibility:** Color‑blind palette, reduced motion, scalable UI, persistent settings.

---

## Roadmap & Milestones
All detailed tasks, prompts, and acceptance criteria live in **[Tasks.md](./Tasks.md)**.

**Milestones (checklist):**
- [x] **Engine Ready** — ECS, determinism, rewind prototype
- [x] **Map & Paths** — Phase‑Shift, overlay layers
- [x] **Combat Core** — Damage/projectiles/status
- [x] **Slice Content** — 8 towers, 8 enemies, 6 artifacts
- [x] **Time Mechanics** — Rewind/Shift/Paradox/Overlay integrated
- [ ] **UX & Audio** — HUD/Timeline/Build UI/Overlay Wheel/WebAudio
- [x] **Meta & Tests** — Tech tree, save/load, telemetry, tests
- [ ] **Perf & PWA** — Optimizations, offline bundle
- [ ] **Docs** — Architecture & Content guides

---

## Documentation
- [ARCHITEKTUR.md](ARCHITEKTUR.md)
- [CONTENT_GUIDE.md](CONTENT_GUIDE.md)
- [BALANCING_GUIDE.md](BALANCING_GUIDE.md)

---

## Contributing
- **Commit standard:** Conventional Commits (`feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `ci`, `build`).
- **Branching:** Feature branches; small PRs (1–3 tasks); draft PRs welcome.
- **Style:** ESLint/Prettier clean; TypeScript `strict`.
- **Reviews:** Focus on determinism, data‑driven design, testing.

Example:
```
feat(engine): add snapshot ring buffer (6s @ 100ms) and rewind API
```

---

## Troubleshooting
- **Jank/GC spikes:** Are pools active? Limit particles; check dev overlay.
- **Desync after rewind:** RNG index correct? Side‑effects in systems?
- **WebGL errors:** Enable Canvas 2D fallback; handle context loss.
- **Playwright failing:** Run `pnpm dlx playwright install --with-deps`.
- **Seed replay differs:** Verify version/hash in replay file; content changed?

---

## License
**TBD** — pick e.g. MIT (permissive) or AGPL‑3.0 (copyleft).  
Add `LICENSE` and adjust the badge above.

---

## Credits
- Placeholder graphics: [Kenney.nl](https://kenney.nl) (CC0) — replace for final build.
- Fonts/Audio: Use license‑compliant assets only (track in `docs/ASSETS.md`).

---

## Contact
Please open a GitHub Issue for ideas/bugs. For larger contributions, include a short demo/GIF with your PR.

---

> “Time is the sharpest blade — learn to wield it.” — ZEITBRUCH
