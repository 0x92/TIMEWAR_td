#!/usr/bin/env node
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const errors = []

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function checkUniqueIds(items, file) {
  const ids = new Set()
  for (const it of items ?? []) {
    if (typeof it.id !== 'string') {
      errors.push(`${file}: missing id`)
    } else if (ids.has(it.id)) {
      errors.push(`${file}: duplicate id ${it.id}`)
    } else {
      ids.add(it.id)
    }
  }
}

function validateMap(file) {
  const data = readJSON(file)
  if (typeof data.width !== 'number' || typeof data.height !== 'number') {
    errors.push(`${file}: invalid dimensions`)
  }
  if (!Array.isArray(data.tiles) || data.tiles.length !== data.width * data.height) {
    errors.push(`${file}: invalid tiles`)
  }
  const nodeIds = new Set()
  for (const n of data.nodes ?? []) {
    if (typeof n.id !== 'number') errors.push(`${file}: node missing id`)
    if (nodeIds.has(n.id)) errors.push(`${file}: duplicate node ${n.id}`)
    nodeIds.add(n.id)
  }
  for (const e of data.edges ?? []) {
    if (typeof e.from !== 'number' || typeof e.to !== 'number') {
      errors.push(`${file}: edge refs invalid`)
    } else if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) {
      errors.push(`${file}: edge refers unknown node`)
    }
  }
}

function validateContent() {
  const dir = path.join('src', 'content')
  checkUniqueIds(readJSON(path.join(dir, 'towers.json')).towers, 'towers.json')
  checkUniqueIds(readJSON(path.join(dir, 'enemies.json')).enemies, 'enemies.json')
  checkUniqueIds(readJSON(path.join(dir, 'artifacts.json')).artifacts, 'artifacts.json')
  const mapsDir = path.join(dir, 'maps')
  if (fs.existsSync(mapsDir)) {
    for (const f of fs.readdirSync(mapsDir)) {
      if (f.endsWith('.json')) validateMap(path.join(mapsDir, f))
    }
  }
}

validateContent()
if (errors.length) {
  for (const e of errors) console.error(e)
  process.exit(1)
} else {
  console.log('content ok')
}
