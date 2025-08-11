import { describe, expect, it } from 'vitest'
import { computeMarkers } from '@ui/timeline'

const events = [
  { time: 1, enemy: 'a' },
  { time: 3, enemy: 'b' },
  { time: 6, enemy: 'c' },
]

describe('timeline', () => {
  it('normalizes events into markers', () => {
    const markers = computeMarkers(events, 0, 5)
    expect(markers).toEqual([0.2, 0.6])
  })
})
