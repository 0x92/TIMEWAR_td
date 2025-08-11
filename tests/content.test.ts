import { describe, expect, it } from 'vitest'
import { parseTowers, parseEnemies, parseArtifacts } from '@content/index'
import fs from 'node:fs'

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

describe('content parsing', () => {
  it('loads towers from json', () => {
    const data = loadJSON('src/content/towers.json')
    const towers = parseTowers(data)
    expect(towers.length).toBe(8)
    expect(towers[0]).toMatchObject({ id: 'tar_pit', damage: 5 })
  })

  it('loads enemies from json', () => {
    const data = loadJSON('src/content/enemies.json')
    const enemies = parseEnemies(data)
    expect(enemies.length).toBe(8)
    expect(enemies[1]).toMatchObject({ id: 'shield_bearer', armor: 0.2 })
  })

  it('loads artifacts from json', () => {
    const data = loadJSON('src/content/artifacts.json')
    const artifacts = parseArtifacts(data)
    expect(artifacts.length).toBe(6)
    expect(artifacts[2]).toMatchObject({ id: 'clockwork_heart', value: 1 })
  })
})
