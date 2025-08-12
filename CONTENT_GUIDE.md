# CONTENT_GUIDE

Alle Gameplay-Werte leben in `src/content` und werden über JSON gepflegt. Die Dateien sind streng mittels JSON-Schemata validiert.

## Dateien
- `towers.json` – Türme
- `enemies.json` – Gegner
- `waves.json` – Spawnpläne
- `artifacts.json` – Artefakte

Die passenden Schemata liegen daneben (`*.schema.json`). Beispiel-Dateien findest du unter `src/content/examples`.

## Neuer Eintrag
1. Passende JSON-Datei bearbeiten.
2. Felder anhand des Schemas ergänzen.
3. `pnpm test` ausführen – schlägt fehl, wenn das Schema verletzt wird.

Beispiel-Turm:
```json
{
  "id": "laser",
  "name": "Laser Tower",
  "damage": 10,
  "range": 5,
  "fireRate": 1.2
}
```

Besteht die Test-Suite, gilt der Content als gültig.
