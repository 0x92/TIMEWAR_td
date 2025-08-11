export type ProjectileType = 'linear' | 'arcing' | 'chain' | 'beam'

export interface Projectile {
  type: ProjectileType
  position: { x: number; y: number }
  velocity?: { x: number; y: number }
  gravity?: number
  range?: number
  traveled?: number
  chainTargets?: number
  onHit?: () => void
}

export class ProjectileSystem {
  private projectiles: Projectile[] = []

  spawn(p: Projectile): void {
    this.projectiles.push(p)
  }

  update(dt: number): void {
    const active: Projectile[] = []
    for (const p of this.projectiles) {
      switch (p.type) {
        case 'linear': {
          if (!p.velocity) break
          p.position.x += p.velocity.x * dt
          p.position.y += p.velocity.y * dt
          const dist = Math.hypot(p.velocity.x, p.velocity.y) * dt
          p.traveled = (p.traveled ?? 0) + dist
          if (!p.range || p.traveled < p.range) {
            active.push(p)
          } else {
            p.onHit?.()
          }
          break
        }
        case 'arcing': {
          if (!p.velocity) break
          p.velocity.y += (p.gravity ?? 0) * dt
          p.position.x += p.velocity.x * dt
          p.position.y += p.velocity.y * dt
          const dist = Math.hypot(p.velocity.x, p.velocity.y) * dt
          p.traveled = (p.traveled ?? 0) + dist
          if (!p.range || p.traveled < p.range) {
            active.push(p)
          } else {
            p.onHit?.()
          }
          break
        }
        case 'beam': {
          p.onHit?.()
          break
        }
        case 'chain': {
          p.onHit?.()
          if ((p.chainTargets ?? 0) > 1) {
            p.chainTargets = (p.chainTargets ?? 0) - 1
            active.push(p)
          }
          break
        }
      }
    }
    this.projectiles = active
  }
}
