import { describe, expect, it, vi } from 'vitest'
import { AccessibilitySettings } from '@ui/accessibility'

describe('AccessibilitySettings', () => {
  it('applies and persists options', () => {
    const root = {
      dataset: {} as Record<string, string>,
      style: { setProperty: vi.fn() },
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    } as unknown as HTMLElement

    const doc = { documentElement: root } as unknown as Document

    const storage = {
      getItem: () => null,
      setItem: vi.fn(),
    }

    const settings = new AccessibilitySettings(undefined, storage, doc)
    settings.toggleColorBlind(true)
    expect(root.dataset.colorBlind).toBe('1')
    settings.toggleReducedMotion(true)
    expect(root.classList.add).toHaveBeenCalledWith('reduced-motion')
    settings.setScale(1.5)
    expect(root.style.setProperty).toHaveBeenCalledWith('--ui-scale', '1.5')
    expect(storage.setItem).toHaveBeenCalledTimes(4)
  })
})
