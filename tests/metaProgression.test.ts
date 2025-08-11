import { describe, expect, it } from 'vitest'
import { MetaProgression } from '@meta/index'
import type { StorageLike } from '@meta/progression'

function createStorage(): StorageLike {
  const map = new Map<string, string>()
  return {
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
  }
}

describe('meta progression', () => {
  it('persists selected faction', () => {
    const storage = createStorage()
    const meta = new MetaProgression(storage)
    meta.selectFaction('chronists')
    const again = new MetaProgression(storage)
    expect(again.getState().faction).toBe('chronists')
  })

  it('migrates old version state', () => {
    const storage = createStorage()
    storage.setItem(
      'zeitbruch_meta',
      JSON.stringify({ version: 0, faction: 'chronists', anomalyCores: 2, upgrades: {} }),
    )
    const meta = new MetaProgression(storage)
    expect(meta.getState().version).toBe(1)
    expect(meta.getState().faction).toBe('chronists')
  })
})
