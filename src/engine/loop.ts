export type UpdateFn = (dt: number) => void

export class FixedStepLoop {
  private accumulator = 0

  constructor(private readonly update: UpdateFn, private readonly step = 1 / 60) {}

  advance(dt: number): void {
    this.accumulator += dt
    const steps = Math.floor(this.accumulator / this.step)
    for (let i = 0; i < steps; i++) {
      this.update(this.step)
    }
    this.accumulator -= steps * this.step
  }
}
