import type { StorageLike } from './controls'

export interface AccessibilityOptions {
  colorBlind: boolean
  reducedMotion: boolean
  uiScale: number
}

const KEY = 'accessibility'

export class AccessibilitySettings {
  private opts: AccessibilityOptions
  private storage: StorageLike
  private doc: Document

  constructor(
    defaults: AccessibilityOptions = { colorBlind: false, reducedMotion: false, uiScale: 1 },
    storage?: StorageLike,
    doc?: Document,
  ) {
    this.storage =
      storage ??
      (typeof localStorage !== 'undefined'
        ? (localStorage as unknown as StorageLike)
        : { getItem: () => null, setItem: () => {} })
    this.doc = doc ?? (typeof document !== 'undefined' ? document : ({} as Document))
    const saved = this.storage.getItem(KEY)
    this.opts = saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults }
    this.apply()
    this.save()
  }

  toggleColorBlind(value: boolean): void {
    this.opts.colorBlind = value
    this.apply()
    this.save()
  }

  toggleReducedMotion(value: boolean): void {
    this.opts.reducedMotion = value
    this.apply()
    this.save()
  }

  setScale(scale: number): void {
    this.opts.uiScale = scale
    this.apply()
    this.save()
  }

  private apply(): void {
    const root = this.doc.documentElement
    if (!root) return
    root.dataset.colorBlind = this.opts.colorBlind ? '1' : '0'
    if (this.opts.reducedMotion) root.classList.add('reduced-motion')
    else root.classList.remove('reduced-motion')
    root.style.setProperty('--ui-scale', String(this.opts.uiScale))
  }

  private save(): void {
    this.storage.setItem(KEY, JSON.stringify(this.opts))
  }
}
