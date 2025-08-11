import { describe, expect, it } from 'vitest'
import { FixedStepLoop, SnapshotBuffer, Xorshift128Plus } from '@engine/index'

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

  it('replays identical RNG sequences across many seeds', () => {
    for (let seed = 0n; seed < 50n; seed++) {
      const r1 = new Xorshift128Plus(seed)
      const r2 = new Xorshift128Plus(seed)
      for (let i = 0; i < 5; i++) {
        expect(r1.next()).toBe(r2.next())
      }
    }
  })

  it('captures and rewinds snapshots deterministically', () => {
    interface State {
      value: number
      rng: { s0: bigint; s1: bigint }
    }

    const rng = new Xorshift128Plus(42n)
    const buffer = new SnapshotBuffer<State>(0.1, 8)

    const outputs: number[] = []
    let state: State = { value: 0, rng: rng.getState() }

    for (let i = 0; i < 10; i++) {
      state.value += 1
      outputs.push(rng.next())
      state.rng = rng.getState()
      buffer.capture(state)
    }

    const snapshot = buffer.rewind(0.5)!
    rng.setState(snapshot.rng)
    const replayOutputs: number[] = []
    const final = buffer.replay(snapshot, 5, s => {
      s.value += 1
      replayOutputs.push(rng.next())
      s.rng = rng.getState()
    })

    expect(final.value).toBe(state.value)
    expect(replayOutputs).toEqual(outputs.slice(5))
  })
})
