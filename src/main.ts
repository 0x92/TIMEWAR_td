import './style.css'
import {
  ResourceManager,
  ParadoxMeter,
  WaveTracker,
  WaveSpawner,
  SnapshotBuffer,
  RewindController,
} from '@engine/index'
import type { Wave } from '@content/waves'
import { bindResource, bindParadox, bindWave } from '@ui/hud'
import { computeMarkers, renderTimeline } from '@ui/timeline'
import { ControlSettings } from '@ui/controls'
import { OverlayWheel } from '@ui/overlayWheel'
import { BuildUI } from '@ui/build'
import { bindRewindButton } from '@ui/time'
import { MetaProgression, factions, type FactionId } from '@meta/index'

if (import.meta.env.DEV) {
  import('@maps/editor')
}

const meta = new MetaProgression(window.localStorage)
const state = meta.getState()
const menu = document.getElementById('menu')!
const hud = document.getElementById('hud')!
const select = document.getElementById('faction-select') as HTMLSelectElement
select.value = state.faction

document.getElementById('start-btn')!.addEventListener('click', () => {
  const faction = select.value as FactionId
  meta.selectFaction(faction)
  menu.style.display = 'none'
  hud.style.display = 'block'
  startRun(faction)
})

function startRun(factionId: FactionId): void {
  const faction = factions[factionId]
  const resources = new ResourceManager()
  const paradox = new ParadoxMeter(1n)
  const waves = new WaveTracker()

  bindResource(resources, 'gold', document.getElementById('res-gold')!)
  bindResource(resources, 'chrono', document.getElementById('res-chrono')!)
  bindResource(resources, 'stability', document.getElementById('res-stability')!)
  bindParadox(paradox, document.getElementById('paradox-meter')!)
  bindWave(waves, document.getElementById('wave-counter')!)

  let gold = 100
  if (faction.modifiers?.startingGoldMultiplier)
    gold *= faction.modifiers.startingGoldMultiplier
  resources.add('gold', gold)
  resources.add('chrono', 50)
  resources.add('stability', 30)

  const spawner = new WaveSpawner(
    [
      { subwaves: [{ enemy: 'raptor', count: 3, delay: 0, interval: 1 }] },
      { subwaves: [{ enemy: 'knight', count: 2, delay: 0, interval: 1 }] },
    ] as Wave[],
    1n,
  )
  const plan = spawner.getPlan()
  const markers = computeMarkers(plan, 0, 10)
  renderTimeline(markers, document.getElementById('timeline')!)

  const controls = new ControlSettings({
    'overlay:prev': 'q',
    'overlay:next': 'e',
    'build:basic': '1',
    'build:sniper': '2',
  })
  const wheel = new OverlayWheel(controls, () => console.log('prev'), () => console.log('next'))
  const build = new BuildUI(
    [
      { id: 'basic', range: 30, key: '1' },
      { id: 'sniper', range: 60, key: '2' },
    ],
    controls,
  )
  window.addEventListener('keydown', e => {
    wheel.handle(e)
    build.handleKey(e.key)
  })

  const canvas = document.getElementById('game') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  canvas.width = 800
  canvas.height = 600
  const mouse = { x: 0, y: 0 }
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    build.place(x, y)
  })
  function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#444'
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    ctx.fillStyle = '#0f0'
    for (const p of build.getPlacements()) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
      ctx.fill()
    }
    const ghost = build.getGhost(mouse.x, mouse.y)
    if (ghost.range > 0) {
      ctx.strokeStyle = ghost.valid ? '#0f0' : '#f00'
      ctx.beginPath()
      ctx.arc(ghost.x, ghost.y, ghost.range, 0, Math.PI * 2)
      ctx.stroke()
    }
    requestAnimationFrame(draw)
  }
  draw()

  const buffer = new SnapshotBuffer<number>(0.1, 6)
  const cost = faction.modifiers?.rewindCostMultiplier ?? 1
  const rewind = new RewindController(buffer, resources, cost)
  bindRewindButton(document.getElementById('rewind-btn')!, rewind, 1)
  setInterval(() => buffer.capture(Date.now()), 100)

  setInterval(() => {
    paradox.add(5)
  }, 1000)

  setInterval(() => {
    waves.next()
  }, 5000)
}
