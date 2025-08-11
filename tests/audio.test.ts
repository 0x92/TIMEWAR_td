import { describe, expect, it } from 'vitest'
import { AudioManager } from '@audio/index'

class MockGainNode {
  gain = { value: 1 }
  connect() {}
}

class MockBufferSource {
  buffer: AudioBuffer | null = null
  private onended: (() => void) | null = null
  connect() {}
  start() {}
  stop() {
    this.onended?.()
  }
  addEventListener(_type: string, cb: () => void) {
    this.onended = cb
  }
}

class MockAudioContext {
  currentTime = 0
  destination = {}
  sources: MockBufferSource[] = []
  createGain() {
    return new MockGainNode() as unknown as GainNode
  }
  createBufferSource() {
    const src = new MockBufferSource()
    this.sources.push(src)
    return src as unknown as AudioBufferSourceNode
  }
  advance(dt: number) {
    this.currentTime += dt
  }
}

describe('audio manager', () => {
  it('controls volume and mute', () => {
    const ctx = new MockAudioContext()
    const audio = new AudioManager(ctx as unknown as AudioContext)
    audio.setMasterVolume(0.5)
    audio.setMusicVolume(0.6)
    audio.setSfxVolume(0.7)
    expect(audio.masterVolumeValue).toBeCloseTo(0.5)
    expect(audio.musicVolumeValue).toBeCloseTo(0.6)
    expect(audio.sfxVolumeValue).toBeCloseTo(0.7)
    audio.setMuted(true)
    expect(audio.masterVolumeValue).toBe(0)
    audio.setMuted(false)
    expect(audio.masterVolumeValue).toBeCloseTo(0.5)
  })

  it('rate limits and queues sfx', () => {
    const ctx = new MockAudioContext()
    const audio = new AudioManager(ctx as unknown as AudioContext, { maxConcurrent: 1 })
    const buffer = {} as AudioBuffer
    audio.addSfx('hit', buffer, 1)
    audio.play('hit')
    expect(ctx.sources.length).toBe(1)
    audio.play('hit')
    expect(ctx.sources.length).toBe(1)
    ctx.advance(1.1)
    audio.play('hit')
    expect(audio.queueLength).toBe(1)
    ctx.sources[0].stop()
    expect(ctx.sources.length).toBe(2)
    expect(audio.queueLength).toBe(0)
  })
})
