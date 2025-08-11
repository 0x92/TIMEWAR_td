export interface Enemy {
  id: string
  name: string
  hp: number
  speed: number
  armor?: number
  phaseShift?: boolean
}

export interface EnemiesFile {
  enemies: Enemy[]
}

function parseEnemy(e: unknown): Enemy {
  const obj = e as Record<string, unknown>
  return {
    id: String(obj.id),
    name: String(obj.name),
    hp: Number(obj.hp ?? 0),
    speed: Number(obj.speed ?? 0),
    armor: obj.armor !== undefined ? Number(obj.armor) : undefined,
    phaseShift: obj.phaseShift === true,
  }
}

export function parseEnemies(data: unknown): Enemy[] {
  if (typeof data !== 'object' || data === null)
    throw new Error('invalid enemy data')
  const raw = (data as Record<string, unknown>).enemies
  if (!Array.isArray(raw)) throw new Error('missing enemies array')
  return raw.map(parseEnemy)
}
