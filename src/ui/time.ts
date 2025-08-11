import type { RewindController } from '@engine/rewind'
import type { EpochOverlay } from '@path/overlay'

export function bindRewindButton<T>(
  button: HTMLElement,
  controller: RewindController<T>,
  seconds: number,
): void {
  button.addEventListener('click', () => {
    controller.tryRewind(seconds)
  })
}

export function bindOverlayCountdown(overlay: EpochOverlay, el: HTMLElement): void {
  el.textContent = '0'
  const update = () => {
    el.textContent = overlay.getRemaining().toFixed(1)
    if (overlay.isActive()) requestAnimationFrame(update)
  }
  if (overlay.isActive()) update()
}
