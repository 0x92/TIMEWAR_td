import { Xorshift128Plus } from '@engine/rng'

export interface WaveFile {
  waves: Wave[]
}

export interface Wave {
  subwaves: Subwave[]
}

export interface Subwave {
  delay: number
  enemy: string
  count: number
  interval: number
  mutators?: string[]
}

export interface SpawnEvent {
  time: number
  enemy: string
  mutator?: string
}

export function createSpawnPlan(data: WaveFile, seed: number | bigint): SpawnEvent[] {
  const rng = new Xorshift128Plus(BigInt(seed))
  let current = 0
  const events: SpawnEvent[] = []
  for (const wave of data.waves) {
    for (const sub of wave.subwaves) {
      current += sub.delay
      for (let i = 0; i < sub.count; i++) {
        const mutator = sub.mutators
          ? sub.mutators[Math.floor(rng.next() * sub.mutators.length)]
          : undefined
        events.push({ time: current + i * sub.interval, enemy: sub.enemy, mutator })
      }
    }
  }
  return events
}

export class Spawner {
  private index = 0
  constructor(private events: SpawnEvent[]) {
    this.events.sort((a, b) => a.time - b.time)
  }

  update(elapsed: number): SpawnEvent[] {
    const spawned: SpawnEvent[] = []
    while (this.index < this.events.length && this.events[this.index].time <= elapsed) {
      spawned.push(this.events[this.index++])
    }
    return spawned
  }
}
