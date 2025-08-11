export interface Artifact {
  id: string
  name: string
  effect: string
  value: number
}

export interface ArtifactsFile {
  artifacts: Artifact[]
}

function parseArtifact(a: unknown): Artifact {
  const obj = a as Record<string, unknown>
  return {
    id: String(obj.id),
    name: String(obj.name),
    effect: String(obj.effect),
    value: Number(obj.value ?? 0),
  }
}

export function parseArtifacts(data: unknown): Artifact[] {
  if (typeof data !== 'object' || data === null)
    throw new Error('invalid artifact data')
  const raw = (data as Record<string, unknown>).artifacts
  if (!Array.isArray(raw)) throw new Error('missing artifacts array')
  return raw.map(parseArtifact)
}
