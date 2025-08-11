import { describe, expect, it } from 'vitest'
import { Telemetry } from '@utils/telemetry'

describe('telemetry', () => {
  it('calculates actions per minute', () => {
    const t = new Telemetry()
    t.recordAction(0)
    t.recordAction(30)
    expect(t.actionsPerMinute(30)).toBe(2)
    expect(t.actionsPerMinute(90)).toBe(1)
  })

  it('evaluates tower mix balance', () => {
    const t = new Telemetry()
    t.recordTower('a')
    t.recordTower('b')
    t.recordTower('c')
    expect(t.isBalanced()).toBe(true)

    const t2 = new Telemetry()
    t2.recordTower('a')
    t2.recordTower('a')
    t2.recordTower('b')
    expect(t2.isBalanced()).toBe(false)
  })
})
