import { describe, expect, it } from 'vitest'
import { BuildUI } from '@ui/build'
import { ControlSettings } from '@ui/controls'

class MemoryStorage {
  private data: Record<string, string> = {}
  getItem(key: string): string | null {
    return this.data[key] ?? null
  }
  setItem(key: string, value: string): void {
    this.data[key] = value
  }
}

describe('build ui', () => {
  it('validates placement and hotkeys', () => {
    const storage = new MemoryStorage()
    const controls = new ControlSettings({}, storage)
    const ui = new BuildUI(
      [{ id: 'a', range: 1, key: '1' }],
      controls,
    )
    ui.handleKey('1')
    expect(ui.place(0, 0)).toBe(true)
    ui.handleKey('1')
    expect(ui.place(0.5, 0)).toBe(false)
    const ghost = ui.getGhost(2, 0)
    expect(ghost.valid).toBe(true)
  })

  it('supports rebind', () => {
    const storage = new MemoryStorage()
    const controls = new ControlSettings({}, storage)
    const ui = new BuildUI(
      [{ id: 'a', range: 1, key: '1' }],
      controls,
    )
    controls.bind('build:a', 'x')
    ui.handleKey('x')
    expect(ui.place(0, 0)).toBe(true)
  })
})
