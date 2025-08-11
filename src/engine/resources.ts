export type ResourceType = 'gold' | 'chrono' | 'stability'

export interface ResourceValues {
  gold: number
  chrono: number
  stability: number
}

export type ResourceListener = (values: ResourceValues) => void

export class ResourceManager {
  private values: ResourceValues
  private listeners = new Set<ResourceListener>()

  constructor(initial?: Partial<ResourceValues>) {
    this.values = {
      gold: 0,
      chrono: 0,
      stability: 0,
      ...initial,
    }
  }

  get(type: ResourceType): number {
    return this.values[type]
  }

  add(type: ResourceType, amount: number): void {
    this.values[type] += amount
    this.emit()
  }

  spend(type: ResourceType, amount: number): boolean {
    if (this.values[type] < amount) return false
    this.values[type] -= amount
    this.emit()
    return true
  }

  subscribe(fn: ResourceListener): () => void {
    this.listeners.add(fn)
    fn(this.values)
    return () => this.listeners.delete(fn)
  }

  private emit(): void {
    for (const fn of this.listeners) fn(this.values)
  }
}
