import { EntityManager, type Entity } from './entity'
import type { ComponentStore } from './component'
import type { System } from './system'

export class World {
  private entities = new EntityManager()
  private systems: System[] = []

  createEntity(): Entity {
    return this.entities.create()
  }

  destroyEntity(entity: Entity): void {
    this.entities.destroy(entity)
  }

  addSystem(system: System): void {
    this.systems.push(system)
  }

  update(dt: number): void {
    for (const system of this.systems) {
      system.update(this, dt)
    }
  }

  query(...stores: ComponentStore<unknown>[]): Entity[] {
    if (stores.length === 0) return []
    const smallest = stores.reduce((a, b) => (a.size < b.size ? a : b))
    const result: Entity[] = []
    outer: for (const entity of smallest.entities) {
      for (const store of stores) {
        if (!store.has(entity)) continue outer
      }
      result.push(entity)
    }
    return result
  }
}
