export interface Node {
  id: number
  x: number
  y: number
}

export interface Edge {
  to: number
  cost: number
  id?: string
  enabled: boolean
}

export class Graph {
  private nodes = new Map<number, Node>()
  private edges = new Map<number, Edge[]>()

  addNode(node: Node): void {
    this.nodes.set(node.id, node)
  }

  addEdge(
    from: number,
    to: number,
    cost: number,
    id?: string,
    enabled = true
  ): void {
    const edge: Edge = { to, cost, id, enabled }
    let list = this.edges.get(from)
    if (!list) {
      list = []
      this.edges.set(from, list)
    }
    list.push(edge)
  }

  toggle(id: string): void {
    for (const list of this.edges.values()) {
      for (const edge of list) {
        if (edge.id === id) {
          edge.enabled = !edge.enabled
        }
      }
    }
  }

  private heuristic(a: Node, b: Node): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }

  findPath(start: number, goal: number): number[] | undefined {
    const startNode = this.nodes.get(start)
    const goalNode = this.nodes.get(goal)
    if (!startNode || !goalNode) return undefined

    interface Record {
      id: number
      f: number
    }

    const open: Record[] = [{ id: start, f: this.heuristic(startNode, goalNode) }]
    const cameFrom = new Map<number, number>()
    const gScore = new Map<number, number>([[start, 0]])

    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f || a.id - b.id)
      const current = open.shift()!.id
      if (current === goal) {
        const path: number[] = [current]
        while (cameFrom.has(path[0])) {
          path.unshift(cameFrom.get(path[0])!)
        }
        return path
      }

      const currentG = gScore.get(current)!
      for (const edge of this.edges.get(current) ?? []) {
        if (!edge.enabled) continue
        const tentativeG = currentG + edge.cost
        const existingG = gScore.get(edge.to)
        if (existingG === undefined || tentativeG < existingG) {
          cameFrom.set(edge.to, current)
          gScore.set(edge.to, tentativeG)
          const f =
            tentativeG +
            this.heuristic(this.nodes.get(edge.to)!, goalNode)
          const record = open.find(r => r.id === edge.to)
          if (record) {
            record.f = f
          } else {
            open.push({ id: edge.to, f })
          }
        }
      }
    }
    return undefined
  }
}

export interface TiledLayer {
  name: string
  data: number[]
}

export interface TiledMap {
  width: number
  height: number
  layers: TiledLayer[]
}

export function graphFromTiled(
  map: TiledMap,
  layerName: string
): Graph {
  const layer = map.layers.find(l => l.name === layerName)
  if (!layer) throw new Error('layer not found')
  const graph = new Graph()
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const idx = y * map.width + x
      if (layer.data[idx] === 0) continue
      graph.addNode({ id: idx, x, y })
    }
  }

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const idx = y * map.width + x
      if (layer.data[idx] === 0) continue
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ]
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue
        const nIdx = ny * map.width + nx
        if (layer.data[nIdx] === 0) continue
        graph.addEdge(idx, nIdx, 1)
      }
    }
  }
  return graph
}
