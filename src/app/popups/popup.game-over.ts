import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/types'
import { PopupSimpleMessage } from '@/popups/simple-message'

export class GameOver extends PopupSimpleMessage implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload']
  public definition: AppScreens = 'GameOver'
  constructor() {
    super('GAME OVER')
  }
}
