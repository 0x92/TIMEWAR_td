import type { FactionId } from './factions'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const UPGRADE_IDS = [
  'tower-range',
  'tower-damage',
  'tower-speed',
  'chrono-efficiency',
  'gold-gain',
  'stability-buffer',
  'paradox-resist',
  'rewind-buffer',
] as const

export type UpgradeId = (typeof UPGRADE_IDS)[number]

export interface MetaState {
  version: number
  faction: FactionId
  anomalyCores: number
  upgrades: Record<UpgradeId, boolean>
}

const DEFAULT_STATE: MetaState = {
  version: 1,
  faction: 'none',
  anomalyCores: 0,
  upgrades: Object.fromEntries(UPGRADE_IDS.map(id => [id, false])) as Record<
    UpgradeId,
    boolean
  >,
}

const STORAGE_KEY = 'zeitbruch_meta'

function mergeState(state: Partial<MetaState>): MetaState {
  return {
    ...DEFAULT_STATE,
    ...state,
    version: DEFAULT_STATE.version,
    upgrades: {
      ...DEFAULT_STATE.upgrades,
      ...(state.upgrades ?? {}),
    },
  }
}

export class MetaProgression {
  private state: MetaState

  constructor(private storage: StorageLike) {
    this.state = this.load()
  }

  private load(): MetaState {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    try {
      const parsed = JSON.parse(raw) as Partial<MetaState>
      const merged = mergeState(parsed)
      if (parsed.version !== DEFAULT_STATE.version)
        this.storage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    } catch {
      return structuredClone(DEFAULT_STATE)
    }
  }

  save(): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  }

  getState(): MetaState {
    return this.state
  }

  selectFaction(f: FactionId): void {
    this.state.faction = f
    this.save()
  }

  unlock(id: UpgradeId): boolean {
    if (this.state.upgrades[id]) return false
    this.state.upgrades[id] = true
    this.save()
    return true
  }
}
