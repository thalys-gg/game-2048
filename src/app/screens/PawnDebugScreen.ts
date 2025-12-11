import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import { Container } from 'pixi.js'
import { UIPawn } from '@/screens/main/UIPawn'

export class PawnDebugScreen extends Container implements IAppScreen {
  public definition: AppScreens = 'PawnDebugScreen'
  public label: string = 'PawnDebugScreen'
  public static assetBundles: TAssetBundleId[] = ['main']
  private pawn: UIPawn

  constructor () {
    super()

    this.pawn = new UIPawn(2, { x: 0, y: 0 })
    this.addChild(this.pawn)
  }

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.pawn.x = screen.width * 0.5
    this.pawn.y = screen.height * 0.5
  }

  public async show () {
    await this.pawn.show()
  }
}
