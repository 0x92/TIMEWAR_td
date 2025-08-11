import type { Graph } from './graph'
import type { ResourceManager } from '@engine/resources'

/** Handles Phase-Shift toggles consuming Stability resource. */
export class PhaseShiftController {
  constructor(
    private readonly graph: Graph,
    private readonly resources: ResourceManager,
    private readonly cost = 1,
  ) {}

  /** Toggles all edges with the given id if enough stability is available. */
  shift(edgeId: string): boolean {
    if (!this.resources.spend('stability', this.cost)) return false
    this.graph.toggle(edgeId)
    return true
  }
}
