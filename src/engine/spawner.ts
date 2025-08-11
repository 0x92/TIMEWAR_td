import { Xorshift128Plus } from './rng'
import type { Wave } from '@content/waves'

export interface SpawnEvent {
  time: number
  enemy: string
  modifier?: string
}

export class WaveSpawner {
  private events: SpawnEvent[] = []

  constructor(waves: Wave[], seed: bigint = 1n) {
    const rng = new Xorshift128Plus(seed)
    let currentTime = 0
    for (const wave of waves) {
      let waveEnd = 0
      for (const sub of wave.subwaves) {
        for (let i = 0; i < sub.count; i++) {
          const t = currentTime + sub.delay + i * sub.interval
          const modifier = sub.modifiers
            ? sub.modifiers[Math.floor(rng.next() * sub.modifiers.length)]
            : undefined
          this.events.push({ time: t, enemy: sub.enemy, modifier })
          const end = sub.delay + sub.count * sub.interval
          if (end > waveEnd) waveEnd = end
        }
      }
      currentTime += waveEnd
    }
    this.events.sort((a, b) => a.time - b.time)
  }

  getPlan(): SpawnEvent[] {
    return this.events
  }
}
