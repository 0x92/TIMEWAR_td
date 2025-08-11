import { describe, expect, it } from 'vitest'
import { Profiler } from '@utils/profiler'

describe('Profiler', () => {
  it('measures duration', async () => {
    const p = new Profiler()
    p.start('a')
    await new Promise((r) => setTimeout(r, 10))
    p.end('a')
    expect(p.get('a')).toBeGreaterThan(0)
  })
})
