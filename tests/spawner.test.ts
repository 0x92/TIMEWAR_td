import { describe, expect, it } from 'vitest'
import { parseWaves } from '@content/waves'
import { WaveSpawner } from '@engine/spawner'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('wave spawner', () => {
  const data = JSON.parse(
    fs.readFileSync(resolve(__dirname, '../src/content/waves.json'), 'utf-8'),
  )
  const waves = parseWaves(data)

  it('produces identical plans for same seed', () => {
    const plan1 = new WaveSpawner(waves, 123n).getPlan()
    const plan2 = new WaveSpawner(waves, 123n).getPlan()
    expect(plan1).toEqual(plan2)
  })

  it('produces different plans for different seeds', () => {
    const plan1 = new WaveSpawner(waves, 1n).getPlan()
    const plan2 = new WaveSpawner(waves, 2n).getPlan()
    expect(plan1).not.toEqual(plan2)
  })
})
