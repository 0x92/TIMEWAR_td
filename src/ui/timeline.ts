import type { SpawnEvent } from '@engine/spawner'

export function computeMarkers(
  events: SpawnEvent[],
  current: number,
  window: number,
): number[] {
  const end = current + window
  const markers: number[] = []
  for (const e of events) {
    if (e.time < current) continue
    if (e.time > end) break
    markers.push((e.time - current) / window)
  }
  return markers
}

export function renderTimeline(markers: number[], el: HTMLElement): void {
  el.innerHTML = ''
  for (const m of markers) {
    const div = document.createElement('div')
    div.className = 'marker'
    div.style.left = `${Math.min(Math.max(m, 0), 1) * 100}%`
    el.appendChild(div)
  }
}
