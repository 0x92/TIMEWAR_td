export interface Subwave {
  enemy: string
  count: number
  interval: number
  delay: number
  modifiers?: string[]
}

export interface Wave {
  subwaves: Subwave[]
}

export interface WavesFile {
  waves: Wave[]
}

function parseSubwave(s: unknown): Subwave {
  const obj = s as Record<string, unknown>
  return {
    enemy: String(obj.enemy),
    count: Number(obj.count),
    interval: Number(obj.interval ?? 0),
    delay: Number(obj.delay ?? 0),
    modifiers: Array.isArray(obj.modifiers)
      ? obj.modifiers.map(m => String(m))
      : undefined,
  }
}

export function parseWaves(data: unknown): Wave[] {
  if (typeof data !== 'object' || data === null)
    throw new Error('invalid waves data')
  const wavesRaw = (data as Record<string, unknown>).waves
  if (!Array.isArray(wavesRaw)) throw new Error('missing waves array')
  return wavesRaw.map(w => {
    const obj = w as Record<string, unknown>
    const subs = Array.isArray(obj.subwaves)
      ? obj.subwaves.map(parseSubwave)
      : []
    return { subwaves: subs }
  })
}
