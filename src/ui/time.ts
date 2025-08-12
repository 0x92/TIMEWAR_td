import type { RewindController } from '@engine/rewind'
import type { EpochOverlay } from '@path/overlay'

export function bindRewindButton<T>(
  button: HTMLElement,
  controller: RewindController<T>,
  seconds: number,
  apply: (state: T) => void,
): void {
  button.addEventListener('click', () => {
    const snap = controller.tryRewind(seconds)
    if (snap) apply(snap)
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
