export class ObjectPool<T> {
  private pool: T[] = []
  constructor(
    private readonly factory: () => T,
    private readonly reset?: (item: T) => void,
  ) {}

  acquire(): T {
    return this.pool.pop() ?? this.factory()
  }

  release(item: T): void {
    this.reset?.(item)
    this.pool.push(item)
  }

  get size(): number {
    return this.pool.length
  }
}
