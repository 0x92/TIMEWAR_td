export type Resource = 'gold' | 'chrono' | 'stability'

export class ResourceManager {
  private values: Record<Resource, number> = {
    gold: 0,
    chrono: 0,
    stability: 0,
  }

  private listeners: Record<Resource, Array<(v: number) => void>> = {
    gold: [],
    chrono: [],
    stability: [],
  }

  get(type: Resource): number {
    return this.values[type]
  }

  add(type: Resource, amount: number): void {
    this.values[type] += amount
    this.emit(type)
  }

  spend(type: Resource, amount: number): boolean {
    if (this.values[type] < amount) return false
    this.values[type] -= amount
    this.emit(type)
    return true
  }

  on(type: Resource, cb: (value: number) => void): void {
    this.listeners[type].push(cb)
  }

  private emit(type: Resource): void {
    for (const cb of this.listeners[type]) cb(this.values[type])
  }
}
