import { describe, expect, it } from 'vitest'
import { SnapshotBuffer, ResourceManager, RewindController, ParadoxMeter } from '@engine/index'
import { Graph } from '@path/graph'
import { PhaseShiftController } from '@path/phaseShift'
import { EpochOverlay } from '@path/overlay'

describe('time mechanics', () => {
  it('rewind consumes chrono and returns snapshot', () => {
    const buffer = new SnapshotBuffer<{ v: number }>(0.1, 1)
    const res = new ResourceManager()
    res.add('chrono', 10)
    const rewind = new RewindController(buffer, res, 2) // cost 2 per second

    rewind.capture({ v: 1 })
    rewind.capture({ v: 2 })

    const snap = rewind.tryRewind(0.1)
    expect(snap?.v).toBe(1)
    expect(res.get('chrono')).toBeCloseTo(9.8)
  })

  it('phase shift toggles edges with stability cost', () => {
    const g = new Graph()
    g.addNode({ id: 1, x: 0, y: 0 })
    g.addNode({ id: 2, x: 1, y: 0 })
    g.addEdge(1, 2, 1, 'a', true)
    const res = new ResourceManager()
    res.add('stability', 5)
    const ps = new PhaseShiftController(g, res, 2)
    const before = g.findPath(1, 2)
    expect(before).toEqual([1, 2])
    const ok = ps.shift('a')
    expect(ok).toBe(true)
    const after = g.findPath(1, 2)
    expect(after).toBeUndefined()
    expect(res.get('stability')).toBe(3)
  })

  it('paradox events are deterministic with same seed', () => {
    const m1 = new ParadoxMeter(1n, 10)
    const m2 = new ParadoxMeter(1n, 10)
    const e1 = m1.add(10)
    const e2 = m2.add(10)
    expect(e1).toBeDefined()
    expect(e1).toBe(e2)
  })

  it('epoch overlay buffs and counts down', () => {
    const overlay = new EpochOverlay([
      { x: 0, y: 0, width: 2, height: 2, buff: 1, resist: 2 },
    ])
    overlay.activate(1)
    expect(overlay.isActive()).toBe(true)
    expect(overlay.getModifiers(1, 1)).toEqual({ buff: 1, resist: 2 })
    overlay.update(0.5)
    expect(overlay.getRemaining()).toBeCloseTo(0.5)
    overlay.update(0.5)
    expect(overlay.isActive()).toBe(false)
  })
})
