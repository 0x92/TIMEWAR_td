import { describe, expect, it } from 'vitest'
import { ResourceManager } from '@engine/resources'
import { bindResource } from '@ui/hud'

describe('resources', () => {
  it('updates HUD bindings on change', () => {
    const manager = new ResourceManager()
    const el = { textContent: '' } as unknown as HTMLElement
    bindResource(manager, 'gold', el)
    expect(el.textContent).toBe('0')
    manager.add('gold', 10)
    expect(el.textContent).toBe('10')
    const ok = manager.spend('gold', 3)
    expect(ok).toBe(true)
    expect(el.textContent).toBe('7')
    const fail = manager.spend('gold', 8)
    expect(fail).toBe(false)
    expect(el.textContent).toBe('7')
  })
})
