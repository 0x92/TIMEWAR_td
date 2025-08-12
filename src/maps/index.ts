import { Graph, type Node, type Edge } from '@path/graph'
import { EpochOverlay, type OverlayZone } from '@path/overlay'

export interface MapEdge extends Edge {
  from: number
}

export interface RelicNode {
  x: number
  y: number
}

export interface MapData {
  width: number
  height: number
  tiles: number[]
  nodes: Node[]
  edges: MapEdge[]
  overlays: OverlayZone[]
  relics: RelicNode[]
}

function isNumber(n: unknown): n is number {
  return typeof n === 'number'
}

export function parseMap(data: unknown): MapData {
  const obj = data as Record<string, unknown>
  if (!isNumber(obj.width) || !isNumber(obj.height)) {
    throw new Error('invalid dimensions')
  }
  if (!Array.isArray(obj.tiles) || obj.tiles.length !== obj.width * obj.height) {
    throw new Error('invalid tiles')
  }
  const nodes: Node[] = []
  if (!Array.isArray(obj.nodes)) throw new Error('nodes missing')
  for (const n of obj.nodes) {
    if (!isNumber(n.id) || !isNumber(n.x) || !isNumber(n.y)) {
      throw new Error('invalid node')
    }
    nodes.push({ id: n.id, x: n.x, y: n.y })
  }
  const edges: MapEdge[] = []
  if (!Array.isArray(obj.edges)) throw new Error('edges missing')
  for (const e of obj.edges) {
    if (
      !isNumber(e.from) ||
      !isNumber(e.to) ||
      !isNumber(e.cost) ||
      (e.id !== undefined && typeof e.id !== 'string')
    ) {
      throw new Error('invalid edge')
    }
    edges.push({ from: e.from, to: e.to, cost: e.cost, id: e.id, enabled: e.enabled ?? true })
  }
  const overlays: OverlayZone[] = []
  if (Array.isArray(obj.overlays)) {
    for (const z of obj.overlays) {
      if (
        !isNumber(z.x) ||
        !isNumber(z.y) ||
        !isNumber(z.width) ||
        !isNumber(z.height) ||
        !isNumber(z.buff) ||
        !isNumber(z.resist)
      ) {
        throw new Error('invalid overlay')
      }
      overlays.push({
        x: z.x,
        y: z.y,
        width: z.width,
        height: z.height,
        buff: z.buff,
        resist: z.resist,
      })
    }
  }
  const relics: RelicNode[] = []
  if (Array.isArray(obj.relics)) {
    for (const r of obj.relics) {
      if (!isNumber(r.x) || !isNumber(r.y)) throw new Error('invalid relic')
      relics.push({ x: r.x, y: r.y })
    }
  }
  return { width: obj.width, height: obj.height, tiles: [...(obj.tiles as number[])], nodes, edges, overlays, relics }
}

export function buildGraph(map: MapData): Graph {
  const g = new Graph()
  for (const n of map.nodes) g.addNode(n)
  for (const e of map.edges) g.addEdge(e.from, e.to, e.cost, e.id, e.enabled)
  return g
}

export function buildOverlay(map: MapData): EpochOverlay {
  return new EpochOverlay(map.overlays ?? [])
}

export { LevelEditor } from './editor'

