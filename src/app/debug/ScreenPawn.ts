import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import { Container } from 'pixi.js'
import { UIPawn } from '@/screens/main/UIPawn'
import { anime } from '@thalys/anime-pixi'
import { waitFor } from '∆/lib/promise'

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

    await waitFor(1)

    this.pawn.alpha = 0
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
