import { CircularProgressBar } from '@pixi/ui'
import { getTheme } from '@/config'

const theme = getTheme()

export class ProgressBar extends CircularProgressBar {
  constructor() {
    super({
      backgroundColor: theme.boardBg,
      fillColor: theme.tiles[0].bg,
      radius: 100,
      lineWidth: 15,
      value: 20,
      backgroundAlpha: 0.5,
      fillAlpha: 0.8,
      cap: 'round',
    })

    this.x += this.width / 2
    this.y += -this.height / 2
  }

  public resize(width: number, height: number) {
    this.position.set(width * 0.5, height * 0.5)
  }

  public set(progress: number) {
    this.progress = progress
  }
}
