export interface Damage {
  physical?: number
  elemental?: number
}

export interface Defense {
  armor?: number
  resistance?: number
}

export interface DamageOptions {
  penetration?: number
  critChance?: number
  critMultiplier?: number
  dot?: number
  stunChance?: number
  rng?: import('@engine/rng').Xorshift128Plus
}

export interface DamageResult {
  amount: number
  critical: boolean
  stunned: boolean
  dot: number
}

export function applyDamage(
  damage: Damage,
  defense: Defense,
  options: DamageOptions = {}
): DamageResult {
  const pen = options.penetration ?? 0
  const armor = Math.max(0, (defense.armor ?? 0) - pen)
  const resist = Math.max(0, (defense.resistance ?? 0) - pen)

  const phys = (damage.physical ?? 0) * (1 - armor)
  const elem = (damage.elemental ?? 0) * (1 - resist)

  let amount = phys + elem
  let critical = false

  const rng = options.rng
  if (rng && (options.critChance ?? 0) > 0) {
    if (rng.next() < (options.critChance ?? 0)) {
      critical = true
      amount *= options.critMultiplier ?? 2
    }
  }

  let stunned = false
  if (rng && (options.stunChance ?? 0) > 0) {
    stunned = rng.next() < (options.stunChance ?? 0)
  }

  return { amount, critical, stunned, dot: options.dot ?? 0 }
}
