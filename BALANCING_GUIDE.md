# BALANCING_GUIDE

Balancing erfolgt datengetrieben über die JSON-Dateien in `src/content`.

## Prinzipien
- Verwende DPS und Time-to-Kill als Grundmetriken.
- Frühe Wellen erklären Mechaniken, Schwierigkeit steigt sanft.
- Änderungen stets im Versionskontrollsystem dokumentieren.

## Workflow
1. Werte in der passenden JSON-Datei anpassen.
2. `pnpm test` ausführen, um Schema-Fehler auszuschließen.
3. Ingame-Metriken oder Telemetrie auswerten.
4. In kleinen Schritten iterieren und erneut testen.

Alle Faktoren sollten im JSON stehen – keine Magic Numbers im Code.
