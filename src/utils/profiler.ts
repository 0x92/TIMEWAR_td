export class Profiler {
  private times = new Map<string, number>()

  start(label: string): void {
    this.times.set(label, performance.now())
  }

  end(label: string): void {
    const start = this.times.get(label)
    if (start !== undefined) {
      this.times.set(label, performance.now() - start)
    }
  }

  get(label: string): number {
    return this.times.get(label) ?? 0
  }
}
