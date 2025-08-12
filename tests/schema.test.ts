import { describe, expect, it } from 'vitest'
import Ajv from 'ajv'
import fs from 'node:fs'

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

describe('content schemas', () => {
  const ajv = new Ajv()

  it('validates towers.json', () => {
    const schema = loadJSON('src/content/towers.schema.json')
    const validate = ajv.compile(schema)
    const data = loadJSON('src/content/towers.json')
    expect(validate(data)).toBe(true)
  })

  it('validates enemies.json', () => {
    const schema = loadJSON('src/content/enemies.schema.json')
    const validate = ajv.compile(schema)
    const data = loadJSON('src/content/enemies.json')
    expect(validate(data)).toBe(true)
  })

  it('validates artifacts.json', () => {
    const schema = loadJSON('src/content/artifacts.schema.json')
    const validate = ajv.compile(schema)
    const data = loadJSON('src/content/artifacts.json')
    expect(validate(data)).toBe(true)
  })

  it('validates waves.json', () => {
    const schema = loadJSON('src/content/waves.schema.json')
    const validate = ajv.compile(schema)
    const data = loadJSON('src/content/waves.json')
    expect(validate(data)).toBe(true)
  })
})
