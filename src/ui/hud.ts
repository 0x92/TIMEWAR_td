import type { Resource, ResourceManager } from '@engine/resources'
import type { ParadoxMeter } from '@engine/paradox'
import type { WaveTracker } from '@engine/wave'

export function bindResource(
  manager: ResourceManager,
  type: Resource,
  el: HTMLElement,
): void {
  el.textContent = String(manager.get(type))
  manager.on(type, value => {
    el.textContent = String(value)
  })
}

export function bindParadox(meter: ParadoxMeter, el: HTMLElement): void {
  el.textContent = '0'
  meter.onChange(v => {
    el.textContent = String(v)
  })
}

export function bindWave(tracker: WaveTracker, el: HTMLElement): void {
  el.textContent = String(tracker.get())
  tracker.onChange(w => {
    el.textContent = String(w)
  })
}
