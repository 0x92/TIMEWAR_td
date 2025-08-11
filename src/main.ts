import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { add } from '@utils/math'
import { ResourceManager, createSpawnPlan } from '@engine/index'
import { HUD } from '@ui/index'
import waves from '@content/waves.sample.json'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

console.log('add demo', add(1, 2))
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const resources = new ResourceManager({ gold: 100, chrono: 50, stability: 100 })
new HUD(resources)
resources.add('gold', 25)

const plan = createSpawnPlan(waves, 42)
console.log('spawn plan', plan)
