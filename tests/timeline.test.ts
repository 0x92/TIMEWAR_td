// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { computeMarkers, setTimelineProgress } from '@ui/timeline'

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

  it('sets progress bar width', () => {
    const el = document.createElement('div')
    const bar = document.createElement('div')
    bar.className = 'progress'
    el.appendChild(bar)
    setTimelineProgress(0.5, el)
    expect(bar.style.width).toBe('50%')
  })
})
