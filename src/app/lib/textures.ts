import { Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import { render } from '@/screens/main/render'

const renderedPawnTextures: Record<number, Texture> = {}
let renderedScoreBg: Texture
let renderedBoardBg: Texture

export default new class {

  public get board () {

    if (renderedBoardBg) return renderedBoardBg

    const width = CONFIG.board.size
    const height = CONFIG.board.size
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.boardBg

    return renderedBoardBg = render()
      .canvas(width, height)
      .draw()
      .squareRounded(0, 0, width, height, radius, color)
      .render()
  }

  public getPawn (value: number) {

    if (renderedPawnTextures[value]) return renderedPawnTextures[value]

    const width = CONFIG.piece.size
    const height = CONFIG.piece.size
    const padding = CONFIG.piece.padding
    const canvasWidth = width + padding * 2
    const canvasHeight = height + padding * 2
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.tiles[value].bg

    return renderedPawnTextures[value] = render()
      .canvas(canvasWidth, canvasHeight)
      .draw()
      .squareRounded(padding, padding, width, height, radius, color)
      .render()
  }

  public get scoreBg () {

    if (renderedScoreBg) return renderedScoreBg

    const { width, height } = CONFIG.score
    const radius = CONFIG.piece.radius
    const color = CONFIG.theme.score.bg

    return renderedScoreBg = render()
      .canvas(width, height)
      .draw()
      .squareRounded(0, 0, width, height, radius, color)
      .render()
  }

  public btnPlay () { return Texture.from('button_rectangle_gradient') }
  public btnPlayPressed () { return Texture.from('button_rectangle_depth_gradient') }


  public get iconSettings () { return Texture.from('gear') }
  public get iconHome () { return Texture.from('home') }
  public get iconLarger () { return Texture.from('larger') }
  public get iconPause () { return Texture.from('pause') }
  public get iconSmaller () { return Texture.from('smaller') }

  public get popupBg () { return Texture.from('button_square_depth_line') }
}()
