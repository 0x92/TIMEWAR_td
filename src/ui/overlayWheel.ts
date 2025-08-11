import type { ControlSettings } from './controls'

export class OverlayWheel {
  constructor(
    private controls: ControlSettings,
    private onPrev: () => void,
    private onNext: () => void,
  ) {}

  handle(e: { key: string }): void {
    const k = e.key.toLowerCase()
    if (k === this.controls.get('overlay:prev')) this.onPrev()
    else if (k === this.controls.get('overlay:next')) this.onNext()
  }
}
