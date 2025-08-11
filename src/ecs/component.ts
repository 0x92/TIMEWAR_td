import type { Entity } from './entity'

export class ComponentStore<T extends Record<string, unknown>> {
  private data: Record<keyof T, T[keyof T][]> = {} as Record<
    keyof T,
    T[keyof T][]
  >
  private index = new Map<Entity, number>()
  public entities: Entity[] = []

  constructor(keys: (keyof T)[]) {
    for (const key of keys) {
      this.data[key] = []
    }
  }

  get size(): number {
    return this.entities.length
  }

  has(entity: Entity): boolean {
    return this.index.has(entity)
  }

  add(entity: Entity, value: T): void {
    if (this.index.has(entity)) throw new Error('component already exists')
    const idx = this.entities.length
    this.entities.push(entity)
    this.index.set(entity, idx)
    for (const key in this.data) {
      const k = key as keyof T
      this.data[k].push(value[k])
    }
  }

  get(entity: Entity): T | undefined {
    const idx = this.index.get(entity)
    if (idx === undefined) return undefined
    const result = {} as Record<keyof T, T[keyof T]>
    for (const key in this.data) {
      const k = key as keyof T
      result[k] = this.data[k][idx]
    }
    return result as T
  }

  set(entity: Entity, partial: Partial<T>): void {
    const idx = this.index.get(entity)
    if (idx === undefined) throw new Error('missing component')
    for (const key in partial) {
      const k = key as keyof T
      this.data[k][idx] = partial[k] as T[typeof k]
    }
  }

  remove(entity: Entity): void {
    const idx = this.index.get(entity)
    if (idx === undefined) return
    const last = this.entities.length - 1
    const lastEntity = this.entities[last]

    for (const key in this.data) {
      const k = key as keyof T
      const arr = this.data[k]
      arr[idx] = arr[last]
      arr.pop()
    }

    this.entities[idx] = lastEntity
    this.entities.pop()
    this.index.set(lastEntity, idx)
    this.index.delete(entity)
  }

  *each(): IterableIterator<[Entity, T]> {
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i]
      const value = {} as Record<keyof T, T[keyof T]>
      for (const key in this.data) {
        const k = key as keyof T
        value[k] = this.data[k][i]
      }
      yield [entity, value as T]
    }
  }
}
