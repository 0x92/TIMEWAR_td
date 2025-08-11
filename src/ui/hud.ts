import type { ResourceManager, ResourceValues } from '@engine/resources'

export class HUD {
  private container: HTMLDivElement
  private gold: HTMLDivElement
  private chrono: HTMLDivElement
  private stability: HTMLDivElement

  constructor(manager: ResourceManager) {
    this.container = document.createElement('div')
    this.container.id = 'hud'
    this.gold = document.createElement('div')
    this.chrono = document.createElement('div')
    this.stability = document.createElement('div')
    this.container.append(this.gold, this.chrono, this.stability)
    document.body.appendChild(this.container)

    manager.subscribe(v => this.update(v))
  }

  private update(v: ResourceValues): void {
    this.gold.textContent = `Gold: ${v.gold}`
    this.chrono.textContent = `Chrono: ${v.chrono}`
    this.stability.textContent = `Stability: ${v.stability}`
  }
}
