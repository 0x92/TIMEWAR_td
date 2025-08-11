import { describe, expect, it } from 'vitest'
import { ParadoxMeter, WaveTracker } from '@engine/index'
import { bindParadox, bindWave } from '@ui/hud'

class StubEl {
  textContent = ''
}

describe('HUD bindings', () => {
  it('updates paradox meter', () => {
    const meter = new ParadoxMeter(1n, 10)
    const el = new StubEl() as unknown as HTMLElement
    bindParadox(meter, el)
    expect(el.textContent).toBe('0')
    meter.add(5)
    expect(el.textContent).toBe('5')
    meter.add(5)
    expect(el.textContent).toBe('0')
  })

  it('updates wave counter', () => {
    const tracker = new WaveTracker()
    const el = new StubEl() as unknown as HTMLElement
    bindWave(tracker, el)
    expect(el.textContent).toBe('0')
    tracker.next()
    expect(el.textContent).toBe('1')
  })
})
