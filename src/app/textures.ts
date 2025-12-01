import { Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import { render } from '@/screens/main/square'

export default new class {

  public get board () {
    const width = CONFIG.board.size
    const height = CONFIG.board.size
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.boardBg

    return render()
      .canvas(width, height)
      .draw()
      .squareRounded(0, 0, width, height, radius, color)
      .render()
  }

  public get empty () {
    const width = CONFIG.piece.size
    const height = CONFIG.piece.size
    const padding = CONFIG.piece.padding
    const canvasWidth = width + padding * 2
    const canvasHeight = height + padding * 2
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.emptyTile

    return render()
      .canvas(canvasWidth, canvasHeight)
      .draw()
      .squareRounded(padding, padding, width, height, radius, color)
      .render()
  }

  public get cell () {
    const width = CONFIG.piece.size
    const height = CONFIG.piece.size
    const padding = CONFIG.piece.padding
    const canvasWidth = width + padding * 2
    const canvasHeight = height + padding * 2
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.tiles[2].bg

    return render()
      .canvas(canvasWidth, canvasHeight)
      .draw()
      .squareRounded(padding, padding, width, height, radius, color)
      .render()
  }


  public btnPlay () { return Texture.from('blue/button_rectangle_gradient') }
  public btnPlayPressed () { return Texture.from('blue/button_rectangle_depth_gradient') }


  public get iconSettings () { return Texture.from('icons/gear') }
  public get iconHome () { return Texture.from('icons/home') }
  public get iconLarger () { return Texture.from('icons/larger') }
  public get iconPause () { return Texture.from('icons/pause') }
  public get iconSmaller () { return Texture.from('icons/smaller') }

  public get popupBg () { return Texture.from('extra/button_square_depth_line') }

  private _logoPixi: { normal: Texture, white: Texture }
  public get logoPixi () {
    if (!this._logoPixi) {
      this._logoPixi = {
        normal: Texture.from('logo.svg'),
        white: Texture.from('logo-white.svg'),
      }
    }

    return this._logoPixi
  }
}()
