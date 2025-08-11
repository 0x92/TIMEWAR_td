import { describe, expect, it } from 'vitest'
import { ControlSettings } from '@ui/controls'
import { OverlayWheel } from '@ui/overlayWheel'

class MemoryStorage {
  private data: Record<string, string> = {}
  getItem(key: string): string | null {
    return this.data[key] ?? null
  }
  setItem(key: string, value: string): void {
    this.data[key] = value
  }
}

describe('overlay wheel', () => {
  it('supports rebindable controls', () => {
    const storage = new MemoryStorage()
    const controls = new ControlSettings(
      { 'overlay:prev': 'q', 'overlay:next': 'e' },
      storage,
    )
    let prev = 0
    let next = 0
    const wheel = new OverlayWheel(controls, () => prev++, () => next++)
    wheel.handle({ key: 'q' })
    wheel.handle({ key: 'e' })
    expect(prev).toBe(1)
    expect(next).toBe(1)
    controls.bind('overlay:next', 'x')
    wheel.handle({ key: 'x' })
    expect(next).toBe(2)
    wheel.handle({ key: 'e' })
    expect(next).toBe(2)
  })
})
