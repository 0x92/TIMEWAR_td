export type Entity = number

export class EntityManager {
  private nextId: Entity = 0
  private free: Entity[] = []

  create(): Entity {
    return this.free.pop() ?? this.nextId++
  }

  destroy(entity: Entity): void {
    this.free.push(entity)
  }
}
