export interface Tower {
  id: string
  name: string
  damage: number
  range: number
  fireRate: number
  effect?: string
  splash?: number
  chain?: number
}

export interface TowersFile {
  towers: Tower[]
}

function parseTower(t: unknown): Tower {
  const obj = t as Record<string, unknown>
  return {
    id: String(obj.id),
    name: String(obj.name),
    damage: Number(obj.damage ?? 0),
    range: Number(obj.range ?? 0),
    fireRate: Number(obj.fireRate ?? 0),
    effect: obj.effect ? String(obj.effect) : undefined,
    splash: obj.splash !== undefined ? Number(obj.splash) : undefined,
    chain: obj.chain !== undefined ? Number(obj.chain) : undefined,
  }
}

export function parseTowers(data: unknown): Tower[] {
  if (typeof data !== 'object' || data === null)
    throw new Error('invalid tower data')
  const raw = (data as Record<string, unknown>).towers
  if (!Array.isArray(raw)) throw new Error('missing towers array')
  return raw.map(parseTower)
}
