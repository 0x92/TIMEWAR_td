export type FactionId = 'none' | 'chronists'

export interface Faction {
  id: FactionId
  name: string
  modifiers?: {
    /** Multiplies rewind energy cost per second */
    rewindCostMultiplier?: number
    /** Multiplies starting gold at run init */
    startingGoldMultiplier?: number
  }
}

export const factions: Record<FactionId, Faction> = {
  none: { id: 'none', name: 'Neutral', modifiers: {} },
  chronists: {
    id: 'chronists',
    name: 'Chronisten',
    modifiers: { rewindCostMultiplier: 0.5, startingGoldMultiplier: 0.8 },
  },
}
