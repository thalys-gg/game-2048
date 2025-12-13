import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/types'
import { anime } from '@thalys/anime-pixi'
import { waitFor } from '∆/lib/promise'
import { Container } from 'pixi.js'
import { UIPawn } from '@/screens/main/UIPawn'

export class ScreenPawn extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenPawn'
  public label: string = 'ScreenPawn'
  public static assetBundles: TAssetBundleId[] = ['main']
  private pawn: UIPawn

  constructor () {
    super()

    this.pawn = new UIPawn(2, { x: 0, y: 0 })
    this.addChild(this.pawn)
  }

  public async show () {

    this.pawn.alpha = 0

    await waitFor(1)

    anime`fade-in`(this.pawn).play()
  }

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.pawn.x = screen.width * 0.5
    this.pawn.y = screen.height * 0.5
  }
}
