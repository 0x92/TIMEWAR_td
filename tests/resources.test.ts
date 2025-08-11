import { describe, expect, it } from 'vitest'
import { ResourceManager } from '@engine/resources'

describe('resources', () => {
  it('tracks and spends resources', () => {
    const manager = new ResourceManager()
    let latest = 0
    manager.subscribe(v => {
      latest = v.gold
    })
    manager.add('gold', 50)
    expect(manager.get('gold')).toBe(50)
    expect(latest).toBe(50)
    expect(manager.spend('gold', 20)).toBe(true)
    expect(manager.get('gold')).toBe(30)
    expect(manager.spend('gold', 40)).toBe(false)
    expect(manager.get('gold')).toBe(30)
  })
})
