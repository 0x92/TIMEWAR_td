import type { Resource, ResourceManager } from '@engine/resources'

export function bindResource(
  manager: ResourceManager,
  type: Resource,
  el: HTMLElement,
): void {
  el.textContent = String(manager.get(type))
  manager.on(type, value => {
    el.textContent = String(value)
  })
}
