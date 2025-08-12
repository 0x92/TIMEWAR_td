# ZEITBRUCH — Codex Workplan (Checklist)

**Ziel:** Vertical Slice im Browser (1 Map, 6–8 Wellen, 8 Türme, 8 Gegner) inkl. **Rewind**, **Phase-Shift**, **Epoch-Overlay**, **Artefakt-Draft**.  
**Stack:** TypeScript + Vite, optional Pixi.js, Vitest, PNPM, GitHub Actions.  
**Prinzipien:** deterministische Simulation, data-driven Balancing, strikte Trennung von Sim/Render.

---

## Fortschritt (visuell)

- [x] P-000: High-Level-Konzept „ZEITBRUCH“ erstellt
- [x] P-001: Erste Tasks.md angelegt
- [x] P-002: Codex-Checklist finalisiert & übernommen (dieses Dokument in Repo)

> **Hinweis:** Alle übrigen Tasks starten auf **[ ]** und werden von Codex/Agent abgehakt.

---

## 0) Leitplanken & DoD

- [ ] D-000: Deterministischer Sim-Loop (Seed ⇒ gleiche Resultate)
- [ ] D-001: 60 FPS Ziel, stabile Frametime, kein GC-Stutter > 4 ms
- [ ] D-002: Rewind ≥ 6 s mit 100 ms Snapshots ohne Desync
- [ ] D-003: Pfadfindung korrekt trotz Phase-Shift
- [ ] D-004: Alle Zahlenwerte in JSON/YAML (data-driven)
- [ ] D-005: Accessibility-Optionen (Farbenblind, reduzierte Motion)
- [ ] D-006: Tests/CI grün; Preview-Deploy

**Prompt für Codex:**

```
Sorge dafür, dass alle Implementierungen die DoD-Punkte D-000..D-006 erfüllen.
Lege pro DoD einen Vitest ab, der die Bedingung prüft (möglichst deterministisch).
```

---

## 1) Projekt-Setup & Infrastruktur

- [x] T-001: Repo & Tooling (Vite + TS, PNPM, ESLint/Prettier, tsconfig Aliase)
- [x] T-002: CI/CD (GitHub Actions: Lint/Test/Build + Preview)
- [x] T-003: Basis-Ordnerstruktur mit Stubs/Interfaces

**Prompt für Codex:**

```
Erstelle ein Vite+TS Projekt mit PNPM. Richte ESLint/Prettier/EditorConfig ein.
tsconfig-Pfade: @ecs, @engine, @path, @combat, @content, @ui, @audio, @scenes, @maps, @utils.
GitHub Actions: node 20.x, pnpm install, lint, test, build, Pages/Netlify Preview.
Output: PR mit README (Setup/Run), Badges, funktionierendem `pnpm dev`.
```

---

## 2) Engine & ECS

- [x] T-010: Minimal-ECS (Entities, Components SoA, Systems-Loop, Pools)
- [x] T-011: Deterministischer Fixed-Step (60 Hz) + RNG (Xorshift128+)
- [x] T-012: Snapshot-Rewind (Ring-Buffer, 6–8 s, 100 ms, Replay)

**Prompt für Codex:**

```
Implementiere ECS unter src/ecs mit SparseSet/Bitmask-Iterationen.
Engine: src/engine/loop.ts (fixed-step), src/engine/rng.ts (Xorshift128+).
Snapshots: src/engine/snapshots.ts (capture/rewind/replay). Vitest: Desync-Schutz.
```

---

## 3) Pfade, Phase-Shift & Tilemap

- [x] T-020: Tilemap-Import (Tiled JSON) + Pfadgraph (A\*)
- [x] T-021: Phase-Shift: toggelbare Kanten/Segmente, deterministischer Recompute
- [x] T-022: Epoch-Overlay: Map-Layer + zonale Buffs/Resists (10–15 s)

**Prompt für Codex:**

```
Implementiere src/path/graph.ts (Knoten/Kanten/A*). Phase-Shift: toggle(id) aktiviert alternative Kanten.
Overlay: Engine-Flag + UI-Icon + Buff-Zonen. Tests: Pfadänderung reproduzierbar, Overlay beeinflusst Stats.
```

---

## 4) Kampfsystem, Projektile, Status

- [x] T-030: Schadensmodell (physisch/elementar, Armor, Pen, Crit, DoT, Stun)
- [x] T-031: Projektile (linear, arcing, chain, beam) + visuelle Demos
- [x] T-032: Status-Effekte (Slow, Burn, Poison, Root, Vulnerable, Bleed)

**Prompt für Codex:**

```
Implementiere Combat in src/combat/*.ts. Einheitliche Damage-Pipeline mit Resists, Pen.
ProjectileSystem unterstützt 4 Typen. StatusSystem mit Stack-Regeln (max, refresh, decay).
Vitest deckt Kombinatorik ab.
```

---

## 5) Ressourcen, Wellen & Spawner

 - [x] T-040: Ressourcen: Gold, Chrono-Energie, Stabilität + HUD
 - [x] T-041: Wellenparser (waves.json) + Spawner mit Subwellen/Mutatoren

**Prompt für Codex:**

```
Ressourcen-Manager mit Bindings ins HUD. waves.json Schema erzeugt Spawns, Delays, Modifiers.
Spawner deterministisch (seeded). Tests für identische Seeds ⇒ identischer Spawnplan.
```

---

## 6) Content v1 (Vertical Slice)

- [x] T-050: Türme (8): Teergrube, Langbogen, Gatling, Mörser, Tesla, Drohnenbucht, Railgun, Grav-Well
- [x] T-051: Gegner (8): Raptor, Schildträger, Ritter, Automat, Infiltrator, Phasenläufer, Singularitätsbrut, Wyrmling
- [x] T-052: Artefakte (6): Sandschiff, Axiom-Keil, Uhrwerk-Herz, Kohlenkiste, Paradox-Scherbe, Stundenglas-Fehler

**Prompt für Codex:**

```
Lege JSON-Schemas + Beispiele für Türme/Gegner/Artefakte an.
Implementiere Factories/Behaviors anhand der JSON-Daten. Tooltips generieren aus Daten.
```

---

## 7) Zeit-Mechaniken (USP)

- [x] T-060: Rewind integriert (Ressourcenverbrauch, UI, No-Dupe-Bugs)
- [x] T-061: Phase-Shift integriert (Kosten über Stabilität, Riss-Risiko)
- [x] T-062: Paradoxon-Meter + 3 Events (Dinos, Nano, Zeitsturm)
- [x] T-063: Epoch-Overlay integriert (Buffs/Resists + Countdown)

**Prompt für Codex:**

```
Verbinde Snapshots mit Rewind-UI/Hotkey; Energieverbrauch.
Phase-Shift ändert Pfade live; Stabilität sinkt. Paradoxon-Meter triggert zufälliges Event (weighted, seeded).
Overlay (10–15 s) verändert Tower/Gegner-Werte; UI-Countdown.
```

---

## 8) UI/UX

- [ ] T-070: HUD & Timeline (Ressourcen, Wellen, Paradox, Marker)
- [ ] T-071: Build-UI + Ghost-Preview (Range, Overlap, Hotkeys)
- [ ] T-072: Overlay-Wheel (Q/E) mit Rebindable Controls

**Prompt für Codex:**

```
Implementiere HUD (Canvas + HTML Layer). Timeline zeigt kommende Marker.
Build-UI mit Ghost-Placement, Reichweite, Validierung. Overlay-Wheel auf Q/E, Rebinding speichern.
```

---

## 9) Audio

- [x] T-080: WebAudio-SFX (Treffer, Kill, Rewind, Overlay) + Mixer (Mute/Vol)

**Prompt für Codex:**

```
AudioManager mit Queues, Rate-Limits, Master/Music/SFX Gains. Keine Clipping-Artefakte.
```

---

## 10) Meta-Progression

 - [x] T-090: Tech-Tree v1 (Anomalie-Kerne, 8 Upgrades, Save/Load)
 - [x] T-091: Fraktion „Chronisten“ (billiger Rewind, weniger Gold)

**Prompt für Codex:**

```
LocalStorage Save/Load mit Versionsmigration. MainMenu: Fraktionswahl; Modifier greifen in Run-Init ein.
```

---

## 11) Telemetrie, Tests, Balancing

- [x] T-100: Telemetrie (Heatmaps, APM, Rewind-Nutzung, Tower-Mix)
- [x] T-101: Tests (ECS, RNG, Damage, Path) + Property-Test (Seed-Replay)
- [x] T-102: Balancing-Pass v1 (3 viable Build-Orders, keine Dominanz)

**Prompt für Codex:**

```
Dev-Overlay zeigt Live-Metriken. Vitest-Coverage ≥ 90 % für /engine & /combat.
```

---

## 12) Performance & Accessibility

 - [x] T-110: Render-Optimierung (Batch, QuadTree, Pools) — 60 FPS @ 500+ Entities
 - [x] T-111: Accessibility (Farbenblind, Reduced Motion, UI-Skalierung, Persistenz)

**Prompt für Codex:**

```
Profiling-Hooks. Adaptive Detail-Stufen. UI-Toggles mit Persistenz.
```

---

## 13) Packaging & PWA

- [ ] T-120: PWA (Service Worker, Manifest, Offline Vertical Slice)

**Prompt für Codex:**

```
Caching-Strategie für Assets/JSON, „Add to Home Screen“, Offline-Test.
```

---

## 14) Dokumentation

 - [x] T-130: JSON-Schemas & Beispiele (towers/enemies/waves/artifacts)
 - [x] T-131: ARCHITEKTUR.md, CONTENT_GUIDE.md, BALANCING_GUIDE.md

**Prompt für Codex:**

```
Erstelle die Docs. Ziel: Onboarding ≤ 30 Minuten. CI validiert JSON-Schemas.
```

---

## 15) Milestones (Häkchen-Übersicht)

- [ ] MS1: Engine Ready — T-001..T-012, T-020
- [ ] MS2: Map & Paths — T-021..T-022
- [ ] MS3: Combat Core — T-030..T-032
- [ ] MS4: Slice Content — T-040..T-052
- [ ] MS5: Zeit-Mechaniken — T-060..T-063
- [ ] MS6: UX & Audio — T-070..T-072, T-080
- [ ] MS7: Meta & Tests — T-090..T-102
- [ ] MS8: Perf & PWA — T-110..T-120
- [ ] MS9: Docs — T-130..T-131

---

## 16) Codex-Ausführungsregeln

- Arbeite in **kleinen PRs** (1–3 Tasks) mit „Akzeptanzkriterien“.
- Ergänze pro PR: kurze Demo-Scene, Vitest-Suite, README-Änderungen.
- Halte RNG deterministisch (kein `Math.random()` außerhalb `@engine/rng`).
- Trenne Sim/Render strikt; Sim headless testbar.

---

## 17) Anhang — Beispiel-JSON (gekürzt)

**tower.railgun.json**

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

**enemy.phase_runner.json**

```json
{
  "id": "phase_runner",
  "hp": 220,
  "speed": 1.35,
  "resist": { "physical": 0.1, "elemental": 0.2 },
  "passives": [{ "type": "blink_on_hit", "distance": 2.5, "cooldown": 3.0 }]
}
```

**wave.sample.json**

```json
{
  "seed": 123456789,
  "entries": [
    { "enemy": "shield_bearer", "count": 12, "interval": 0.6 },
    { "enemy": "phase_runner", "count": 6, "interval": 0.9, "delay": 3.0 }
  ],
  "modifiers": ["+10% armor", "stealth_scouts"]
}
```

---

## 18) Level-Editor & Content-Pipeline

- [ ] T-180: Interner Level-Editor (Tilemap, Pfadsegmente, Shift-Toggles)
- [ ] T-181: Export/Import `maps/*.json` inkl. Overlays & Relikt-Nodes
- [ ] T-182: Validator für Content (Schemas, Referenz-IDs, Balance-Warnungen)

**Prompt für Codex:**

```
Erstelle einen eingebauten Editor (nur Dev-Build). Funktionen: Tiles setzen, Pfadknoten/Kanten definieren, Phase-Shift-Toggles markieren, Overlay-Zonen malen.
Export als JSON; Implementiere Validator CLI: `pnpm validate:content`.
Akzeptanz: Map laden/spielen, Roundtrip Import/Export ohne Diff.
```

---

## 19) Modding-API & Data-Layer

- [ ] T-190: Plugin-Ladepunkt (nur JSON/JS-Module im Sandbox-Scope)
- [ ] T-191: Hot-Reload für Content-Dateien im Dev-Server
- [ ] T-192: Harte Sandbox: kein Netzwerk/DOM-Zugriff für Mods

**Prompt für Codex:**

```
Implementiere Content-Loader mit sicheren Imports (dynamic import in Sandbox).
Dev: HMR für JSON/Modules. Security: evaluate im isolierten Realm.
Akzeptanz: Beispielmod: neuer Turm + Gegner; Tests für Sandbox-Restriktion.
```

---

## 20) Replays & Seed-Sharing

- [ ] T-200: Replay-Aufzeichnung (Inputs + Seed + Versionshash)
- [ ] T-201: Replay-Abspielung mit Kontrolle (Play/Pause/Scrub, x0.5–x4)
- [ ] T-202: Seed-Sharing (URL-Param) + „Weekly Race“-Seed

**Prompt für Codex:**

```
Speichere nur Inputs/Timing + RNG-Seed. Replays deterministisch abspielbar.
UI: Replay-Controls. Share: `?seed=...&weekly=YYYY-Www`.
Akzeptanz: Replay 1:1 identisch (Checksum der Metriken).
```

---

## 21) Controller & Touch

- [ ] T-210: Gamepad-Support (Build/Select/Confirm/Cancel/Hotkeys)
- [ ] T-211: Touch-Optimierung (Gesten: Pinch, Pan, Long-Press für Build)
- [ ] T-212: Haptik (Vibration API) optional

**Prompt für Codex:**

```
Input-Abstraktion: Keyboard/Mouse/Gamepad/Touch unified.
UI-Fokusrahmen für Gamepad. Touch: Ghost-Placement mit Snap.
Akzeptanz: Tutorial-Level vollständig ohne Maus spielbar.
```

---

## 22) Responsive & Mobile Performance

- [ ] T-220: Layout-Skalierung (HUD adaptiv, UI-Safe-Areas)
- [ ] T-221: Adaptive Render-Qualität (Entitätenlimit, Partikel, Schatten)
- [ ] T-222: FPS/Memory Watchdog + Auto-Downgrade

**Prompt für Codex:**

```
Implementiere DPI-/Viewport-Erkennung, UI-Safe-Areas (Notch).
Qualitätsstufen per Heuristik (FPS < 50 ⇒ Stufe runter).
Akzeptanz: Stable 50+ FPS auf Mittelklasse-Android.
```

---

## 23) Lokalisierung & Fonts

- [ ] T-230: i18n (en, de) mit ICU-Format
- [ ] T-231: Font-Fallbacks & Mesh-Text (WebGL) für Performance
- [ ] T-232: Lokalisierbare Daten (Tower-/Gegner-Beschreibungen)

**Prompt für Codex:**

```
i18n-Provider, Keys in UI & Content. Lazy-Load Locale-Packs.
Akzeptanz: Sprache umschaltbar ohne Reload; 0% „hardcoded“ UI-Strings.
```

---

## 24) Analytics & Datenschutz (GDPR)

- [ ] T-240: Opt-in Analytics (anonym, lokal gepuffert)
- [ ] T-241: Datenschutzseite + Consent-Dialog
- [ ] T-242: Telemetrie-Events minimieren/salzen (keine PII)

**Prompt für Codex:**

```
Consent-Gate (LocalStorage). Sende nur anonymisierte Metriken (APM, Build-Mix).
DSGVO-Text, Toggle im Menü. Akzeptanz: Spiel vollständig ohne Consent spielbar.
```

---

## 25) Crash-/Log-Telemetrie

- [ ] T-250: Fehler-Tracker (window.onerror, unhandledrejection)
- [ ] T-251: Log-Ringpuffer (letzte 200 Events) für Bugreports
- [ ] T-252: Safe-Mode-Boot bei Crash-Schleifen

**Prompt für Codex:**

```
Error-Hooks, anonymisierte Stacktraces, Versionshash mitschicken.
Knopf „Fehler melden“ exportiert JSON (Log + Sysinfo).
Akzeptanz: Crash reproduzierbar → Safe-Mode mit ausgeschalteten Effekten.
```

---

## 26) E2E-Tests (Playwright)

- [ ] T-260: Smoke-Test: Boot → MainMenu → Level → 2 Wellen
- [ ] T-261: Rewind/Phase-Shift/Overlay E2E-Szenarien
- [ ] T-262: Mobile-Viewport-Test (Touch-Controls)

**Prompt für Codex:**

```
Richte Playwright CI ein. Schreibe 3 E2E-Suiten.
Akzeptanz: Headless grün auf CI (Linux).
```

---

## 27) Security & Supply Chain

- [ ] T-270: Lockfile-Audit (pnpm audit, dependabot)
- [ ] T-271: SRI/Integrity für CDN-Assets; CSP-Header (Docs)
- [ ] T-272: Determinismus-Wächter (Dev-asserts gegen `Math.random()`/Date.now())

**Prompt für Codex:**

```
Audit-Workflow, Renovate/Dependabot. Build blockiert bei kritischen CVEs.
Lint-Regel: verbietet nondeterministische APIs in Sim-Code.
```

---

## 28) Live-Balance & Dev-Konsole

- [ ] T-280: In-Game Console (~) mit Commands (spawn, give, overlay)
- [ ] T-281: Live-Tuning von JSON-Werten (nur Dev) + Hot-Apply
- [ ] T-282: Heatmap-Overlay ein/aus

**Prompt für Codex:**

```
Dev-Konsole (nur Dev-Build). Live-Änderungen an Content anwenden.
Akzeptanz: Balance-Designer kann ohne Rebuild justieren.
```

---

## 29) Monetarisierung (nur kosmetisch)

- [ ] T-290: Skins für Türme/Projektile (rein visuell)
- [ ] T-291: Shop-Mock (keine echten Payments) + Inventar
- [ ] T-292: Drop-Tabelle (kosmetische Belohnungen)

**Prompt für Codex:**

```
Kosmetik-System mit Overrides (Sprites/SFX). Shop-Mock lädt aus JSON.
Akzeptanz: Aktivierter Skin verändert nur Optik, keine Werte.
```

---

## 30) Release & Distribution

- [ ] T-300: Versionierung (SemVer, CHANGELOG.md, Auto-Tag in CI)
- [ ] T-301: PWA-Release-Bundle + Offline-Testplan
- [ ] T-302: Landingpage mit Trailer-GIF, Features, How-to-Play

**Prompt für Codex:**

```
GitHub Release-Workflow mit Changelog-Generator.
PWA-Bundle auditen (Lighthouse). Landingpage statisch, minimal.
Akzeptanz: Installierbare PWA, dokumentierter Release-Prozess.
```
