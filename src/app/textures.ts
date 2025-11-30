import { Texture } from 'pixi.js'

export default new class {
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
