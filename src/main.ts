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
import { FixedStepLoop } from '@engine/loop'

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

  interface Tower {
    x: number
    y: number
    range: number
    cd: number
  }
  const towers: Tower[] = []
  const enemies: Array<{ x: number; y: number; hp: number; speed: number }> = []
  let spawnIndex = 0
  let simTime = 0

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (build.place(x, y)) {
      const p = build.getPlacements().slice(-1)[0]
      towers.push({ x: p.x, y: p.y, range: p.range, cd: 0 })
    }
  })

  const loop = new FixedStepLoop(dt => {
    simTime += dt
    while (spawnIndex < plan.length && plan[spawnIndex].time <= simTime) {
      enemies.push({ x: 0, y: canvas.height / 2, hp: 20, speed: 40 })
      spawnIndex++
    }
    for (const e of enemies) e.x += e.speed * dt
    for (const t of towers) {
      t.cd -= dt
      if (t.cd <= 0) {
        const target = enemies.find(
          en => Math.hypot(en.x - t.x, en.y - t.y) <= t.range,
        )
        if (target) {
          target.hp -= 10
          t.cd = 1
        }
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      const en = enemies[i]
      if (en.hp <= 0) {
        enemies.splice(i, 1)
        resources.add('gold', 5)
        continue
      }
      if (en.x > canvas.width) {
        enemies.splice(i, 1)
        resources.spend('stability', 1)
      }
    }
  })

  function render(): void {
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
    for (const t of towers) {
      ctx.beginPath()
      ctx.arc(t.x, t.y, 8, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#f00'
    for (const e of enemies) {
      ctx.beginPath()
      ctx.arc(e.x, e.y, 10, 0, Math.PI * 2)
      ctx.fill()
    }
    const ghost = build.getGhost(mouse.x, mouse.y)
    if (ghost.range > 0) {
      ctx.strokeStyle = ghost.valid ? '#0f0' : '#f00'
      ctx.beginPath()
      ctx.arc(ghost.x, ghost.y, ghost.range, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  let last = performance.now()
  function frame(time: number): void {
    const dt = (time - last) / 1000
    last = time
    loop.advance(dt)
    render()
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

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
