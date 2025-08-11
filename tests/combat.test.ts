import { describe, expect, it } from 'vitest'
import { applyDamage, StatusSystem } from '@combat/index'
import { Xorshift128Plus } from '@engine/rng'

describe('damage pipeline', () => {
  it('calculates damage with penetration and crit', () => {
    const rng = new Xorshift128Plus(1n)
    const result = applyDamage(
      { physical: 100, elemental: 50 },
      { armor: 0.2, resistance: 0.5 },
      {
        penetration: 0.1,
        critChance: 1,
        critMultiplier: 2,
        stunChance: 1,
        dot: 5,
        rng,
      }
    )
    // physical: 100 * (1 - (0.2-0.1)) = 90
    // elemental: 50 * (1 - (0.5-0.1)) = 30
    // total = 120 * critMultiplier 2 = 240
    expect(result.amount).toBeCloseTo(240)
    expect(result.critical).toBe(true)
    expect(result.stunned).toBe(true)
    expect(result.dot).toBe(5)
  })
})

describe('status system', () => {
  it('applies stacks with refresh and decay', () => {
    const s = new StatusSystem()
    s.apply('burn', { duration: 5, maxStacks: 3, decay: 1 })
    s.apply('burn', { duration: 5, maxStacks: 3, decay: 1 })
    expect(s.get('burn')?.stacks).toBe(2)
    s.update(5)
    expect(s.get('burn')?.stacks).toBe(1)
    s.update(1)
    expect(s.get('burn')).toBeUndefined()
  })
})
