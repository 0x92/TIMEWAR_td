import { describe, expect, it } from 'vitest'
import { ComponentStore, World, type System } from '@ecs/index'

interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

class MovementSystem implements System {
  private positions: ComponentStore<Position>
  private velocities: ComponentStore<Velocity>
  constructor(
    positions: ComponentStore<Position>,
    velocities: ComponentStore<Velocity>
  ) {
    this.positions = positions
    this.velocities = velocities
  }

  update(world: World, dt: number): void {
    for (const entity of world.query(this.positions, this.velocities)) {
      const pos = this.positions.get(entity)!
      const vel = this.velocities.get(entity)!
      this.positions.set(entity, {
        x: pos.x + vel.x * dt,
        y: pos.y + vel.y * dt,
      })
    }
  }
}

describe('ecs', () => {
  it('runs system loop and updates components', () => {
    const world = new World()
    const positions = new ComponentStore<Position>(['x', 'y'])
    const velocities = new ComponentStore<Velocity>(['x', 'y'])
    world.addSystem(new MovementSystem(positions, velocities))

    const e = world.createEntity()
    positions.add(e, { x: 0, y: 0 })
    velocities.add(e, { x: 1, y: 1 })

    world.update(1)

    expect(positions.get(e)).toEqual({ x: 1, y: 1 })
  })

  it('reuses entity ids via pool', () => {
    const world = new World()
    const e1 = world.createEntity()
    world.destroyEntity(e1)
    const e2 = world.createEntity()
    expect(e2).toBe(e1)
  })
})
