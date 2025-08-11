import './style.css'
import { ResourceManager, ParadoxMeter, WaveTracker, WaveSpawner } from '@engine/index'
import type { Wave } from '@content/waves'
import { bindResource, bindParadox, bindWave } from '@ui/hud'
import { computeMarkers, renderTimeline } from '@ui/timeline'
import { ControlSettings } from '@ui/controls'
import { OverlayWheel } from '@ui/overlayWheel'

// basic setup
const resources = new ResourceManager()
const paradox = new ParadoxMeter(1n)
const waves = new WaveTracker()

bindResource(resources, 'gold', document.getElementById('res-gold')!)
bindResource(resources, 'chrono', document.getElementById('res-chrono')!)
bindResource(resources, 'stability', document.getElementById('res-stability')!)
bindParadox(paradox, document.getElementById('paradox-meter')!)
bindWave(waves, document.getElementById('wave-counter')!)

resources.add('gold', 100)
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

const controls = new ControlSettings({ 'overlay:prev': 'q', 'overlay:next': 'e' })
const wheel = new OverlayWheel(controls, () => console.log('prev'), () => console.log('next'))
window.addEventListener('keydown', e => wheel.handle(e))

// demo paradox fill
setInterval(() => {
  paradox.add(5)
}, 1000)

// demo wave advance
setInterval(() => {
  waves.next()
}, 5000)
