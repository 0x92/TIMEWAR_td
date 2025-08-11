export interface TowerMix {
  [towerId: string]: number
}

/**
 * Telemetry collects gameplay metrics for dev analysis.
 * It tracks generic actions for APM calculation and tower usage
 * for basic balancing insights.
 */
export class Telemetry {
  private actions: number[] = []
  private towers: Record<string, number> = {}

  /**
   * Record an arbitrary action at a given time (seconds).
   * Times are provided by the caller to keep determinism.
   */
  recordAction(time: number): void {
    this.actions.push(time)
    // prune actions older than 60s
    const cutoff = time - 60
    while (this.actions.length && this.actions[0] < cutoff) this.actions.shift()
  }

  /**
   * Actions per minute over the last 60 seconds.
   */
  actionsPerMinute(currentTime: number): number {
    const cutoff = currentTime - 60
    while (this.actions.length && this.actions[0] < cutoff) this.actions.shift()
    return this.actions.length
  }

  /**
   * Record a tower build event.
   */
  recordTower(id: string): void {
    this.towers[id] = (this.towers[id] ?? 0) + 1
  }

  /**
   * Percentage mix of built towers.
   */
  towerMix(): TowerMix {
    const total = Object.values(this.towers).reduce((a, b) => a + b, 0)
    const mix: TowerMix = {}
    for (const [id, count] of Object.entries(this.towers)) {
      mix[id] = count / total
    }
    return mix
  }

  /**
   * Determine if tower mix is balanced: at least `minTypes` towers and
   * no single tower exceeds `maxShare` usage.
   */
  isBalanced(minTypes = 3, maxShare = 0.5): boolean {
    const mix = this.towerMix()
    const types = Object.keys(mix)
    if (types.length < minTypes) return false
    return types.every(t => mix[t] <= maxShare)
  }

  reset(): void {
    this.actions = []
    this.towers = {}
  }
}

export const telemetry = new Telemetry()
