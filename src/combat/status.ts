export type StatusType =
  | 'slow'
  | 'burn'
  | 'poison'
  | 'root'
  | 'vulnerable'
  | 'bleed'
  | 'stun'

export interface StatusConfig {
  duration: number
  maxStacks: number
  decay: number
}

interface StatusInstance extends StatusConfig {
  stacks: number
  remaining: number
}

export class StatusSystem {
  private statuses = new Map<StatusType, StatusInstance>()

  apply(type: StatusType, config: StatusConfig): void {
    const existing = this.statuses.get(type)
    if (existing) {
      existing.stacks = Math.min(existing.stacks + 1, config.maxStacks)
      existing.duration = config.duration
      existing.decay = config.decay
      existing.remaining = config.duration
      existing.maxStacks = config.maxStacks
    } else {
      this.statuses.set(type, {
        type,
        stacks: 1,
        remaining: config.duration,
        ...config,
      })
    }
  }

  update(dt: number): void {
    for (const [type, s] of this.statuses) {
      s.remaining -= dt
      if (s.remaining <= 0) {
        s.stacks -= 1
        if (s.stacks > 0) {
          s.remaining = s.decay
        } else {
          this.statuses.delete(type)
        }
      }
    }
  }

  get(type: StatusType): StatusInstance | undefined {
    return this.statuses.get(type)
  }
}
