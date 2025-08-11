export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const KEY = 'controls'

export class ControlSettings {
  private bindings: Record<string, string>
  private storage: StorageLike

  constructor(
    defaults: Record<string, string> = {},
    storage?: StorageLike,
  ) {
    this.storage =
      storage ??
      (typeof localStorage !== 'undefined'
        ? (localStorage as unknown as StorageLike)
        : { getItem: () => null, setItem: () => {} })
    const saved = this.storage.getItem(KEY)
    this.bindings = saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults }
    for (const [k, v] of Object.entries(defaults)) {
      if (!(k in this.bindings)) this.bindings[k] = v
    }
    this.save()
  }

  get(action: string): string {
    return this.bindings[action]
  }

  bind(action: string, key: string): void {
    this.bindings[action] = key.toLowerCase()
    this.save()
  }

  private save(): void {
    this.storage.setItem(KEY, JSON.stringify(this.bindings))
  }
}
