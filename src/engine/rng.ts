export class Xorshift128Plus {
  private s0: bigint
  private s1: bigint

  constructor(seed = 1n) {
    let s = BigInt(seed)
    if (s === 0n) s = 1n
    // simple splitmix64 to fill state
    this.s0 = this.splitMix64(s)
    this.s1 = this.splitMix64(this.s0)
  }

  private splitMix64(seed: bigint): bigint {
    let z = (seed + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n & 0xffffffffffffffffn
    z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn & 0xffffffffffffffffn
    return z ^ (z >> 31n)
  }

  next(): number {
    let s1 = this.s0
    const s0 = this.s1
    this.s0 = s0
    s1 ^= s1 << 23n
    s1 ^= s1 >> 17n
    s1 ^= s0
    s1 ^= s0 >> 26n
    this.s1 = s1
    const result = (this.s0 + this.s1) & 0xffffffffffffffffn
    // convert to double in [0,1)
    return Number(result >> 11n) / Number(0x20000000000000n)
  }
}
