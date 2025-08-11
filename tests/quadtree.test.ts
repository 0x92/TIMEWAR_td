import { describe, expect, it } from 'vitest'
import { QuadTree, Rect } from '@utils/quadtree'

describe('QuadTree', () => {
  it('queries items within range', () => {
    const qt = new QuadTree({ x: 0, y: 0, w: 100, h: 100 }, 4)
    for (let i = 0; i < 10; i++) {
      qt.insert({ x: i * 10, y: i * 10, w: 5, h: 5, id: i } as Rect & { id: number })
    }
    const found = qt.query({ x: 0, y: 0, w: 25, h: 25 }) as Array<Rect & { id: number }>
    expect(found.map((f) => f.id)).toEqual([0, 1, 2])
  })
})
