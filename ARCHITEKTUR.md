# ARCHITEKTUR

Diese Datei beschreibt die grobe Struktur von **ZEITBRUCH**. Die Simulation läuft strikt getrennt vom Rendering und bleibt deterministisch.

## Kernmodule
- **Engine** (`src/engine`): Fixed-Step-Loop (60 Hz), RNG und Snapshot-Rewind.
- **ECS** (`src/ecs`): Sparse‑Set Storage und System-Scheduler.
- **Content** (`src/content`): Alle Werte in JSON mit Schemata und Parsern.
- **Path** (`src/path`): Tilemap und Pfadgraph mit Phase‑Shift.
- **Combat** (`src/combat`): Schaden, Projektile und Status‑Effekte.
- **UI & Scenes** (`src/ui`, `src/scenes`): Darstellung, HUD und Spielzustände.

Die Simulation greift nie direkt auf DOM oder Zeitfunktionen zu. Rendering liest Snapshots aus der Sim.

## Ordnerüberblick
```
src/
  ecs/       # Entity-Component-System
  engine/    # Loop, RNG, Snapshots
  path/      # Maps und A*
  combat/    # Damage-Pipeline
  content/   # JSON-Daten + Schemata
  ui/        # HUD, Build-Menü, Overlay-Wheel
  scenes/    # Boot, Menü, Level
  …
tests/       # Vitest-Suites
```

`pnpm dev` startet den Dev‑Server, `pnpm test` führt alle Tests aus.
