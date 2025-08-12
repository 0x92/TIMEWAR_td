import type { MapData, MapEdge } from './index'
import type { OverlayZone } from '@path/overlay'

/** Simple in-memory level editor used in dev builds. */
export class LevelEditor {
  private map: MapData

  constructor(width: number, height: number) {
    this.map = {
      width,
      height,
      tiles: Array(width * height).fill(0),
      nodes: [],
      edges: [],
      overlays: [],
      relics: [],
    }
  }

  static from(data: MapData): LevelEditor {
    const ed = new LevelEditor(data.width, data.height)
    ed.map = structuredClone(data)
    return ed
  }

  setTile(x: number, y: number, value: number): void {
    this.map.tiles[y * this.map.width + x] = value
  }

  addNode(id: number, x: number, y: number): void {
    this.map.nodes.push({ id, x, y })
  }

  addEdge(from: number, to: number, cost: number, id?: string, enabled = true): void {
    const edge: MapEdge = { from, to, cost, id, enabled }
    this.map.edges.push(edge)
  }

  toggleEdge(id: string): void {
    for (const e of this.map.edges) {
      if (e.id === id) e.enabled = !e.enabled
    }
  }

  addOverlay(zone: OverlayZone): void {
    this.map.overlays.push(zone)
  }

  addRelic(x: number, y: number): void {
    this.map.relics.push({ x, y })
  }

  export(): MapData {
    return structuredClone(this.map)
  }
}
declare global {
  interface Window {
    LevelEditor: typeof LevelEditor
  }
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.LevelEditor = LevelEditor
}

