export class WaveTracker {
  private current = 0
  private listeners: Array<(w: number) => void> = []

  get(): number {
    return this.current
  }

  next(): void {
    this.current++
    this.emit()
  }

  onChange(cb: (wave: number) => void): void {
    this.listeners.push(cb)
  }

  private emit(): void {
    for (const cb of this.listeners) cb(this.current)
  }
}
