import type { SnapshotBuffer } from './snapshots'
import type { ResourceManager } from './resources'

/** Controls time rewind using a SnapshotBuffer and Chrono resource. */
export class RewindController<T> {
  private readonly buffer: SnapshotBuffer<T>
  private readonly resources: ResourceManager
  private readonly costPerSecond: number
  constructor(buffer: SnapshotBuffer<T>, resources: ResourceManager, costPerSecond = 1) {
    this.buffer = buffer
    this.resources = resources
    this.costPerSecond = costPerSecond
  }

  capture(state: T): void {
    this.buffer.capture(state)
  }

  /**
   * Attempts to rewind the given number of seconds. Returns the snapshot if
   * enough Chrono energy is available; otherwise undefined and no rewind occurs.
   */
  tryRewind(seconds: number): T | undefined {
    const cost = seconds * this.costPerSecond
    if (!this.resources.spend('chrono', cost)) return undefined
    return this.buffer.rewind(seconds)
  }
}
