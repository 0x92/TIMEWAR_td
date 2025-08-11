export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

function intersects(a: Rect, b: Rect): boolean {
  return !(b.x > a.x + a.w ||
    b.x + b.w < a.x ||
    b.y > a.y + a.h ||
    b.y + b.h < a.y)
}

export class QuadTree<T extends Rect> {
  private items: T[] = []
  private divided = false
  private northeast?: QuadTree<T>
  private northwest?: QuadTree<T>
  private southeast?: QuadTree<T>
  private southwest?: QuadTree<T>

  constructor(
    private readonly boundary: Rect,
    private readonly capacity = 4,
  ) {}

  insert(item: T): boolean {
    if (!intersects(this.boundary, item)) return false
    if (this.items.length < this.capacity) {
      this.items.push(item)
      return true
    }
    if (!this.divided) this.subdivide()
    return (
      this.northeast!.insert(item) ||
      this.northwest!.insert(item) ||
      this.southeast!.insert(item) ||
      this.southwest!.insert(item)
    )
  }

  query(range: Rect, found: T[] = []): T[] {
    if (!intersects(this.boundary, range)) return found
    for (const item of this.items) {
      if (intersects(item, range)) found.push(item)
    }
    if (this.divided) {
      this.northeast!.query(range, found)
      this.northwest!.query(range, found)
      this.southeast!.query(range, found)
      this.southwest!.query(range, found)
    }
    return found
  }

  clear(): void {
    this.items = []
    if (this.divided) {
      this.northeast!.clear()
      this.northwest!.clear()
      this.southeast!.clear()
      this.southwest!.clear()
      this.northeast = this.northwest = this.southeast = this.southwest = undefined
      this.divided = false
    }
  }

  private subdivide(): void {
    const { x, y, w, h } = this.boundary
    const hw = w / 2
    const hh = h / 2
    this.northeast = new QuadTree({ x: x + hw, y, w: hw, h: hh }, this.capacity)
    this.northwest = new QuadTree({ x, y, w: hw, h: hh }, this.capacity)
    this.southeast = new QuadTree({ x: x + hw, y: y + hh, w: hw, h: hh }, this.capacity)
    this.southwest = new QuadTree({ x, y: y + hh, w: hw, h: hh }, this.capacity)
    this.divided = true
  }
}
