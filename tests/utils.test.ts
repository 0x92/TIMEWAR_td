import { describe, expect, it } from 'vitest'
import { add } from '@utils/math'

describe('add', () => {
  it('adds numbers deterministically', () => {
    expect(add(1, 2)).toBe(3)
  })
})
