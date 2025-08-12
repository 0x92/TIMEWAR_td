import type { ControlSettings } from './controls'

export interface TowerDef {
  id: string
  range: number
  key: string
}

interface Placement {
  x: number
  y: number
  def: TowerDef
}

export class BuildUI {
  private placements: Placement[] = []
  private selected: TowerDef | null = null
  constructor(
    private defs: TowerDef[],
    private controls: ControlSettings,
  ) {
    for (const def of defs) {
      const action = `build:${def.id}`
      const existing = controls.get(action)
      if (!existing) controls.bind(action, def.key)
    }
  }

  handleKey(key: string): void {
    for (const def of this.defs) {
      if (this.controls.get(`build:${def.id}`) === key.toLowerCase()) {
        this.selected = def
        return
      }
    }
  }

  private overlaps(x: number, y: number, r: number): boolean {
    for (const p of this.placements) {
      const dx = p.x - x
      const dy = p.y - y
      if (Math.hypot(dx, dy) < p.def.range + r) return true
    }
    return false
  }

  canPlace(x: number, y: number): boolean {
    if (!this.selected) return false
    return !this.overlaps(x, y, this.selected.range)
  }

  getGhost(x: number, y: number): { x: number; y: number; range: number; valid: boolean } {
    if (!this.selected) return { x, y, range: 0, valid: false }
    return { x, y, range: this.selected.range, valid: this.canPlace(x, y) }
  }

  place(x: number, y: number): boolean {
    if (!this.canPlace(x, y) || !this.selected) return false
    this.placements.push({ x, y, def: this.selected })
    return true
  }

  getPlacements(): { x: number; y: number; range: number }[] {
    return this.placements.map(p => ({ x: p.x, y: p.y, range: p.def.range }))
  }
}
