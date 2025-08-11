import { Xorshift128Plus } from './rng'

export type ParadoxEvent = 'dinos' | 'nano' | 'zeitsturm'

interface Weighted<T> {
  item: T
  weight: number
}

/**
 * Tracks paradox energy and triggers seeded random events once the threshold is
 * reached. The RNG ensures deterministic results for equal seeds.
 */
export class ParadoxMeter {
  private value = 0
  private readonly threshold: number
  private readonly rng: Xorshift128Plus
  private readonly events: Weighted<ParadoxEvent>[]
  private listeners: Array<(v: number) => void> = []

  constructor(seed: bigint, threshold = 100, events?: Weighted<ParadoxEvent>[]) {
    this.threshold = threshold
    this.rng = new Xorshift128Plus(seed)
    this.events =
      events ?? [
        { item: 'dinos', weight: 1 },
        { item: 'nano', weight: 1 },
        { item: 'zeitsturm', weight: 1 },
      ]
  }

  add(amount: number): ParadoxEvent | undefined {
    this.value += amount
    if (this.value < this.threshold) {
      this.emit()
      return undefined
    }
    this.value = 0
    this.emit()
    return this.pickEvent()
  }

  onChange(cb: (value: number) => void): void {
    this.listeners.push(cb)
  }

  private emit(): void {
    for (const cb of this.listeners) cb(this.value)
  }

  private pickEvent(): ParadoxEvent {
    const total = this.events.reduce((s, e) => s + e.weight, 0)
    const r = this.rng.next() * total
    let acc = 0
    for (const e of this.events) {
      acc += e.weight
      if (r < acc) return e.item
    }
    return this.events[this.events.length - 1].item
  }
}
