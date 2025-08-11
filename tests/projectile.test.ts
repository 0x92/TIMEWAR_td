import { describe, expect, it, vi } from 'vitest'
import { ProjectileSystem } from '@combat/projectile'

describe('projectile system', () => {
  it('updates linear projectiles', () => {
    const sys = new ProjectileSystem()
    sys.spawn({
      type: 'linear',
      position: { x: 0, y: 0 },
      velocity: { x: 1, y: 0 },
      range: 10,
    })
    sys.update(1)
    expect(sys['projectiles'][0].position.x).toBeCloseTo(1)
  })

  it('handles arcing projectiles', () => {
    const sys = new ProjectileSystem()
    sys.spawn({
      type: 'arcing',
      position: { x: 0, y: 0 },
      velocity: { x: 1, y: 0 },
      gravity: 1,
      range: 10,
    })
    sys.update(1)
    const p = sys['projectiles'][0]
    expect(p.position.x).toBeCloseTo(1)
    expect(p.position.y).toBeCloseTo(1)
  })

  it('fires beams instantly', () => {
    const hit = vi.fn()
    const sys = new ProjectileSystem()
    sys.spawn({ type: 'beam', position: { x: 0, y: 0 }, onHit: hit })
    sys.update(0)
    expect(hit).toHaveBeenCalled()
  })

  it('chains between targets', () => {
    const hit = vi.fn()
    const sys = new ProjectileSystem()
    sys.spawn({
      type: 'chain',
      position: { x: 0, y: 0 },
      chainTargets: 2,
      onHit: hit,
    })
    sys.update(0)
    sys.update(0)
    expect(hit).toHaveBeenCalledTimes(2)
  })
})
