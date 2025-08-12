import { describe, expect, it } from 'vitest'
import { LevelEditor } from '@maps/editor'
import { parseMap, buildGraph, buildOverlay } from '@maps/index'
import fs from 'node:fs'

function loadMap() {
  return JSON.parse(fs.readFileSync('src/content/maps/demo.json', 'utf-8'))
}

describe('level editor', () => {
  it('roundtrips export/import without diff', () => {
    const ed = new LevelEditor(2, 2)
    ed.setTile(0, 0, 1)
    ed.addNode(0, 0, 0)
    ed.addNode(1, 1, 0)
    ed.addEdge(0, 1, 1, 'phase')
    ed.addOverlay({ x: 0, y: 0, width: 1, height: 1, buff: 0.1, resist: 0.2 })
    ed.addRelic(1, 1)
    const exported = ed.export()
    const imported = parseMap(JSON.parse(JSON.stringify(exported)))
    const ed2 = LevelEditor.from(imported)
    expect(ed2.export()).toEqual(exported)
  })
})

describe('map loading', () => {
  it('builds graph and overlay from json', () => {
    const data = parseMap(loadMap())
    const graph = buildGraph(data)
    const overlay = buildOverlay(data)
    expect(graph.findPath(0, 1)).toEqual([0, 1])
    overlay.activate(1)
    expect(overlay.isActive()).toBe(true)
  })
})
