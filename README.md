# ZEITBRUCH — Zeitreise-Tower-Defense im Browser

> **Vertical Slice Ziel:** 1 Map · 6–8 Wellen · 8 Türme · 8 Gegner · **Rewind**, **Phase-Shift**, **Epoch-Overlay**, **Artefakt-Draft**  
> **Stack:** TypeScript · Vite · PNPM · (optional) Pixi.js/WebGL · Vitest · Playwright · GitHub Actions

![ZEITBRUCH](docs/hero-placeholder.png)
*(Platzhalter – ersetze durch In-Game Screenshot/GIF)*

![Badges](https://img.shields.io/badge/status-WIP-orange) ![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blue) ![license](https://img.shields.io/badge/license-TBD-lightgrey)

---

## Inhaltsverzeichnis
- [Überblick](#überblick)
- [Hauptfeatures](#hauptfeatures)
- [Technischer Stack](#technischer-stack)
- [Anforderungen](#anforderungen)
- [Schnellstart](#schnellstart)
- [Projektstruktur](#projektstruktur)
- [Scripts](#scripts)
- [Content & Datengetriebenes Design](#content--datengesteuertes-design)
- [Determinismus-Regeln](#determinismus-regeln)
- [Zeit-Mechaniken](#zeit-mechaniken)
- [Tests & Qualität](#tests--qualität)
- [Performance & Accessibility Ziele](#performance--accessibility-ziele)
- [Roadmap & Meilensteine](#roadmap--meilensteine)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Lizenz](#lizenz)
- [Credits](#credits)

---

## Überblick
**ZEITBRUCH** ist ein Tower-Defense mit **Zeit-Manipulation**: Du spulst Sekunden zurück, überblendest Epochen (mit anderen Buffs/Resistenzen) und veränderst Gegnerpfade „on the fly“. Jede Intervention füllt ein **Paradoxon-Meter** – stark, aber riskant.

Dieses Repository zielt zuerst auf einen **Vertical Slice**, danach auf Early Access mit Meta-Progression, Telemetrie und PWA-Release.

---

## Hauptfeatures
- 🔁 **Rewind** (≥ 6 s): Rollback via Snapshots (100 ms) ohne Desync.
- 🔀 **Phase-Shift**: Umschaltbare Pfadsegmente, deterministische Re-Pfadfindung.
- 🕰️ **Epoch-Overlay**: Temporäre Epoche mit Map-Buffs/Resists (10–15 s).
- ⚡ **Paradoxon-Events**: Bei 100% treten zufällige Ereignisse (seeded) auf.
- 🧩 **Data-Driven Content**: Türme/Gegner/Wellen/Artefakte als JSON + Schemas.
- 🧪 **Tests**: Vitest (Unit/Property), Playwright (E2E), CI mit GitHub Actions.
- 📊 **Telemetry (Dev)**: Heatmaps, DPS/Leaks, Rewind-Nutzung, Tower-Mix.
- 📱 **PWA & Mobile**: Responsive HUD, Safe Areas, Offline Vertical Slice.

---

## Technischer Stack
- **Core:** TypeScript, Vite (dev server & build)
- **Rendering:** Canvas 2D oder WebGL (Pixi.js optional)
- **Architektur:** ECS (Entities/Components/Systems)
- **Tests:** Vitest (Unit), Playwright (E2E)
- **Audio:** WebAudio API
- **CI/CD:** GitHub Actions, optional Pages/Netlify Preview
- **Package:** PNPM, Node ≥ 20 LTS

---

## Anforderungen
- **Node:** 20.x (LTS) – via `.nvmrc`
- **PNPM:** ≥ 9  
- **Browser:** Chrome/Edge/Firefox aktuell (WebGL empfohlen)

---

## Schnellstart
```bash
# 1) Dependencies
pnpm i

# 2) Dev-Server
pnpm dev
# -> http://localhost:5173

# 3) Tests (Unit)
pnpm test

# 4) Lint & Types
pnpm lint
pnpm typecheck

# 5) Build
pnpm build
pnpm preview
```

Optional: **Playwright** installieren und E2E ausführen
```bash
pnpm dlx playwright install --with-deps
pnpm e2e
```

---

## Projektstruktur
```
/src
  /ecs            # Entity-Component-System
  /engine         # Loop, RNG, Snapshots, Determinismus
  /path           # Tilemap, A*, Phase-Shift
  /combat         # Damage, Projektile, Status
  /content        # JSON: Türme, Gegner, Wellen, Artefakte (+Schemas)
  /ui             # HUD, Timeline, Build-UI, Overlay-Wheel
  /audio          # AudioManager, SFX
  /scenes         # Boot, MainMenu, Map
  /maps           # Tiled-JSON + Overlays/Relikte
  /utils          # Helpers, Types, Logging
/tests            # Vitest Suiten
/e2e              # Playwright
/docs             # Screenshots, Specs
```

**Wichtige Aliase (`tsconfig.json`)**: `@ecs`, `@engine`, `@path`, `@combat`, `@content`, `@ui`, `@audio`, `@scenes`, `@maps`, `@utils`

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

## Content & Datengesteuertes Design
- **Schemas:** `content/*.schema.json` – CI validiert alle Content-Dateien.
- **Beispiele:** `content/examples/*` – Referenzwerte für Tooltips & Tests.
- **Waves:** `content/waves/*.json` – deterministische Spawns via Seed.
- **Maps:** `maps/*.json` – Tiled-Layout, Pfadkanten, Overlay-Zonen, Relikte.

Beispiel Tower (Railgun):
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

## Determinismus-Regeln
**Definition of Done (Auszug):**
- Fester **Fixed-Step** (z. B. 60 Hz) in der Simulation, Render interpoliert.
- Eigener RNG (`@engine/rng` Xorshift128+), **kein** `Math.random()` im Sim-Code.
- Snapshot-Rewind: Ring-Buffer (≥ 6 s, 100 ms) mit deterministischem Replay.
- Keine Zeit-Abfragen im Sim-Code (`Date.now()` verboten) – nur Ticks.
- Re-Pathing bei Phase-Shift ist reproduzierbar (gleiches Seed ⇒ gleiche Pfade).
- Unit- & Property-Tests sichern deterministisches Verhalten ab.

---

## Zeit-Mechaniken
- **Rewind:** Spult die letzten Sekunden zurück (Positionen/HP/Status). Kostet **Chrono-Energie**, erhöht **Entropie** (Balancing).
- **Phase-Shift:** Aktiviert/Deaktiviert alternative Pfadkanten. Erhöht Tower-Uptime, senkt **Stabilität**.
- **Epoch-Overlay:** 10–15 s Epoche mit Buffs/Resists (z. B. Mittelalter → +Range Ballista).
- **Paradoxon:** Eingriffe füllen das Meter; bei 100% triggert ein Ereignis (z. B. Dino-Stampede). Loot: **Anomalie-Kerne** (Meta).

---

## Tests & Qualität
- **Unit/Component:** Vitest (Coverage-Ziel: ≥ 90% für `/engine` & `/combat`).
- **Property-Test:** Gleiches Seed ⇒ gleichen Metrics-Checksum (Determinismus).
- **E2E:** Playwright (Boot → Level → Rewind/Phase-Shift/Overlay Szenarien).
- **CI:** Lint, Test, Build, Preview-Artifact/Pages.

PR-Checkliste:
- [ ] Tests grün (Unit/E2E), Coverage OK
- [ ] Keine nondeterministischen APIs im Sim-Code
- [ ] JSON-Content validiert (Schemas)
- [ ] README/Docs aktualisiert
- [ ] Demo-Scene oder GIF für das Feature

---

## Performance & Accessibility Ziele
- **Performance:** 60 FPS @ 500+ Entitäten (Desktop), stabile Frametime (< 4 ms Stutter).
- **Mobile:** ≥ 50 FPS auf Mittelklasse-Android; adaptive Qualitätsstufen.
- **Accessibility:** Farbenblind-Modus, reduzierte Motion, skalierbare UI, persistente Settings.

---

## Roadmap & Meilensteine
Die detaillierten Aufgaben, Prompts und Akzeptanzkriterien stehen in **[Tasks.md](./Tasks.md)**.

**Meilensteine (Kurz):**
1. **Engine Ready** — ECS, Determinismus, Rewind-Prototyp
2. **Map & Paths** — Phase-Shift, Overlay-Layer
3. **Combat Core** — Damage/Projektile/Status
4. **Slice Content** — 8 Türme, 8 Gegner, 6 Artefakte
5. **Zeit-Mechaniken** — Rewind/Shift/Paradoxon/Overlay integriert
6. **UX & Audio** — HUD/Timeline/Build-UI/Overlay-Wheel/WebAudio
7. **Meta & Tests** — Tech-Tree, Save/Load, Telemetrie, Tests
8. **Perf & PWA** — Optimierungen, Offline-Bundle
9. **Docs** — Architektur & Content-Guides

---

## Contributing
- **Commit-Standard:** Conventional Commits (feat, fix, refactor, test, chore, docs, perf, ci, build).
- **Branching:** Feature-Branches, kleine PRs (1–3 Tasks), Draft-PRs willkommen.
- **Style:** ESLint/Prettier müssen sauber sein; TypeScript strict.
- **Code-Reviews:** Fokus auf Determinismus, Datengetriebenheit, Tests.

Beispiel Commit:
```
feat(engine): add snapshot ring buffer (6s @ 100ms) and rewind API
```

---

## Troubleshooting
- **Ruckler/GC-Spikes:** Pools aktiv? Partikel begrenzen, Dev-Overlay checken.
- **Desync nach Rewind:** RNG-Position korrekt? Keine Side-Effects in Systems?
- **WebGL-Fehler:** Fallback auf Canvas 2D aktivieren; Kontextverlust behandeln.
- **Playwright rot:** `pnpm dlx playwright install --with-deps` ausgeführt?
- **Seed-Replay anders:** Prüfe Version/Hash in Replay-Datei; Content geändert?

---

## Lizenz
**TBD** – wähle z. B. MIT (offen) oder AGPL-3.0 (Copyleft).  
Datei `LICENSE` hinzufügen und Badge oben anpassen.

---

## Credits
- Platzhalter-Grafiken: [Kenney.nl](https://kenney.nl) (CC0) — ersetzen in finalem Build.
- Fonts/Audio: Bitte nur lizenzkonforme Assets verwenden (Verzeichnis `docs/ASSETS.md` pflegen).

---

## Kontakt
Issues & Ideen bitte als GitHub Issue anlegen. Für größere Beiträge: PR mit kurzer Demo/GIF.

---

> „Zeit ist die schärfste Waffe – lerne, sie zu führen.“ — ZEITBRUCH
