export class SnapshotBuffer<T> {
  private readonly buffer: (T | undefined)[]
  private index = 0
  private readonly interval: number
  constructor(interval = 0.1, duration = 8) {
    this.interval = interval
    this.buffer = new Array(Math.ceil(duration / interval))
  }

  capture(state: T): void {
    this.buffer[this.index] = structuredClone(state)
    this.index = (this.index + 1) % this.buffer.length
  }

  rewind(secondsAgo: number): T | undefined {
    const steps = Math.floor(secondsAgo / this.interval)
    if (steps >= this.buffer.length) return undefined
    const idx = (this.index - 1 - steps + this.buffer.length) % this.buffer.length
    const snapshot = this.buffer[idx]
    return snapshot === undefined ? undefined : structuredClone(snapshot)
  }

  replay(snapshot: T, steps: number, update: (state: T, dt: number) => void): T {
    const state = structuredClone(snapshot)
    for (let i = 0; i < steps; i++) {
      update(state, this.interval)
    }
    return state
  }
}
