import { describe, expect, it } from 'vitest'
import { FixedStepLoop, Xorshift128Plus } from '@engine/index'

describe('engine', () => {
  it('runs fixed-step updates', () => {
    const steps: number[] = []
    const loop = new FixedStepLoop(dt => steps.push(dt))
    loop.advance(1)
    expect(steps.length).toBe(60)
    expect(steps.every(s => s === 1 / 60)).toBe(true)
  })

  it('is deterministic regardless of frame splits', () => {
    let count1 = 0
    const loop1 = new FixedStepLoop(() => count1++)
    loop1.advance(1)

    let count2 = 0
    const loop2 = new FixedStepLoop(() => count2++)
    loop2.advance(0.5)
    loop2.advance(0.5)

    expect(count1).toBe(count2)
  })

  it('generates deterministic RNG sequence', () => {
    const rng1 = new Xorshift128Plus(123n)
    const rng2 = new Xorshift128Plus(123n)
    const seq1 = [rng1.next(), rng1.next(), rng1.next()]
    const seq2 = [rng2.next(), rng2.next(), rng2.next()]
    expect(seq1).toEqual([
      0.4137666069746663,
      0.7670110024952262,
      0.6227989828702096,
    ])
    expect(seq1).toEqual(seq2)
  })
})
