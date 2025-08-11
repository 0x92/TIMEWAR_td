export type SfxName = 'hit' | 'kill' | 'rewind' | 'overlay'

interface SfxEntry {
  buffer: AudioBuffer
  rateLimit: number
  lastPlay: number
}

interface AudioManagerOptions {
  maxConcurrent?: number
}

export class AudioManager {
  private ctx: AudioContext
  private master: GainNode
  private music: GainNode
  private sfx: GainNode
  private muted = false
  private masterVolume = 1
  private maxConcurrent: number
  private activeSources = 0
  private queue: SfxName[] = []
  private sfxMap = new Map<SfxName, SfxEntry>()

  constructor(context: AudioContext = new AudioContext(), options: AudioManagerOptions = {}) {
    this.ctx = context
    this.master = this.ctx.createGain()
    this.master.connect(this.ctx.destination)

    this.music = this.ctx.createGain()
    this.music.connect(this.master)

    this.sfx = this.ctx.createGain()
    this.sfx.connect(this.master)

    this.maxConcurrent = options.maxConcurrent ?? 8
  }

  addSfx(name: SfxName, buffer: AudioBuffer, rateLimit = 0.05): void {
    this.sfxMap.set(name, { buffer, rateLimit, lastPlay: -Infinity })
  }

  play(name: SfxName): void {
    const entry = this.sfxMap.get(name)
    if (!entry) return

    const now = this.ctx.currentTime
    if (now - entry.lastPlay < entry.rateLimit) return

    if (this.activeSources >= this.maxConcurrent) {
      this.queue.push(name)
      return
    }

    const source = this.ctx.createBufferSource()
    source.buffer = entry.buffer
    source.connect(this.sfx)
    source.addEventListener('ended', () => {
      this.activeSources--
      this.flushQueue()
    })
    source.start()
    entry.lastPlay = now
    this.activeSources++
  }

  private flushQueue(): void {
    if (!this.queue.length) return
    const now = this.ctx.currentTime
    for (let i = 0; i < this.queue.length && this.activeSources < this.maxConcurrent; ) {
      const name = this.queue.shift() as SfxName
      const entry = this.sfxMap.get(name)
      if (!entry) continue
      if (now - entry.lastPlay < entry.rateLimit) continue
      const source = this.ctx.createBufferSource()
      source.buffer = entry.buffer
      source.connect(this.sfx)
      source.addEventListener('ended', () => {
        this.activeSources--
        this.flushQueue()
      })
      source.start()
      entry.lastPlay = now
      this.activeSources++
    }
  }

  setMasterVolume(value: number): void {
    this.masterVolume = Math.max(0, Math.min(1, value))
    if (!this.muted) this.master.gain.value = this.masterVolume
  }

  setMusicVolume(value: number): void {
    this.music.gain.value = Math.max(0, Math.min(1, value))
  }

  setSfxVolume(value: number): void {
    this.sfx.gain.value = Math.max(0, Math.min(1, value))
  }

  setMuted(mute: boolean): void {
    this.muted = mute
    this.master.gain.value = mute ? 0 : this.masterVolume
  }

  get masterVolumeValue(): number {
    return this.master.gain.value
  }

  get musicVolumeValue(): number {
    return this.music.gain.value
  }

  get sfxVolumeValue(): number {
    return this.sfx.gain.value
  }

  get queueLength(): number {
    return this.queue.length
  }
}
