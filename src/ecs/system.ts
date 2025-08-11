import type { World } from './world'

export interface System {
  update(world: World, dt: number): void
}
