export interface OverlayZone {
  x: number
  y: number
  width: number
  height: number
  buff: number
  resist: number
}

export class EpochOverlay {
  private active = false
  private remaining = 0
  private zones: OverlayZone[]
  constructor(zones: OverlayZone[]) {
    this.zones = zones
  }

  activate(duration: number): void {
    this.active = true
    this.remaining = duration
  }

  update(dt: number): void {
    if (!this.active) return
    this.remaining -= dt
    if (this.remaining <= 0) {
      this.active = false
      this.remaining = 0
    }
  }

  isActive(): boolean {
    return this.active
  }

  getRemaining(): number {
    return this.remaining
  }

  getModifiers(x: number, y: number): { buff: number; resist: number } {
    if (!this.active) return { buff: 0, resist: 0 }
    let buff = 0
    let resist = 0
    for (const z of this.zones) {
      if (
        x >= z.x &&
        y >= z.y &&
        x < z.x + z.width &&
        y < z.y + z.height
      ) {
        buff += z.buff
        resist += z.resist
      }
    }
    return { buff, resist }
  }
}
