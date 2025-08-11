import { describe, expect, it } from 'vitest'
import { Graph, graphFromTiled, EpochOverlay } from '@path/index'

describe('path graph', () => {
  it('imports tiled map and computes A* path', () => {
    const map = {
      width: 2,
      height: 1,
      layers: [{ name: 'walk', data: [1, 1] }],
    }
    const g = graphFromTiled(map, 'walk')
    const path = g.findPath(0, 1)
    expect(path).toEqual([0, 1])
  })

  it('toggles phase-shift edges deterministically', () => {
    const g = new Graph()
    g.addNode({ id: 1, x: 0, y: 0 })
    g.addNode({ id: 2, x: 1, y: 0 })
    g.addNode({ id: 3, x: 1, y: 1 })
    g.addNode({ id: 4, x: 2, y: 1 })
    g.addEdge(1, 2, 1)
    g.addEdge(2, 1, 1)
    g.addEdge(2, 4, 1, 'phase', true)
    g.addEdge(4, 2, 1, 'phase', true)
    g.addEdge(2, 3, 1, 'phase', false)
    g.addEdge(3, 2, 1, 'phase', false)
    g.addEdge(3, 4, 1)
    g.addEdge(4, 3, 1)
    g.addEdge(1, 3, 5)
    g.addEdge(3, 1, 5)

    const path1 = g.findPath(1, 4)
    expect(path1).toEqual([1, 2, 4])

    g.toggle('phase')
    const path2 = g.findPath(1, 4)
    expect(path2).toEqual([1, 2, 3, 4])

    g.toggle('phase')
    const path3 = g.findPath(1, 4)
    expect(path3).toEqual(path1)
  })
})

describe('epoch overlay', () => {
  it('applies buffs when active', () => {
    const overlay = new EpochOverlay([
      { x: 0, y: 0, width: 2, height: 2, buff: 0.5, resist: 0.3 },
    ])
    overlay.activate(10)
    expect(overlay.getModifiers(1, 1)).toEqual({ buff: 0.5, resist: 0.3 })
    overlay.update(10)
    expect(overlay.getModifiers(1, 1)).toEqual({ buff: 0, resist: 0 })
  })
})
