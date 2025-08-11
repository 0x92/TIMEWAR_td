import { describe, expect, it } from 'vitest'
import waves from '@content/waves.sample.json'
import { createSpawnPlan, Spawner } from '@engine/spawner'

describe('spawner', () => {
  it('produces deterministic plans for same seed', () => {
    const plan1 = createSpawnPlan(waves, 123)
    const plan2 = createSpawnPlan(waves, 123)
    expect(plan1).toEqual(plan2)
  })

  it('spawns events at correct times', () => {
    const plan = createSpawnPlan(waves, 1)
    const spawner = new Spawner(plan)
    const first = spawner.update(plan[0].time)
    expect(first.length).toBe(1)
    expect(first[0].enemy).toBe('Raptor')
  })
})
