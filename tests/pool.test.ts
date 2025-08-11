import { describe, expect, it } from 'vitest'
import { ObjectPool } from '@utils/pool'

describe('ObjectPool', () => {
  it('reuses released objects', () => {
    let created = 0
    const pool = new ObjectPool(() => ({ id: ++created }), (o) => {
      o.id = 0
    })
    const a = pool.acquire()
    expect(a.id).toBe(1)
    pool.release(a)
    expect(pool.size).toBe(1)
    const b = pool.acquire()
    expect(b.id).toBe(0)
    expect(created).toBe(1)
  })
})
