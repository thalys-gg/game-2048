import type { IAppScreen } from '∆/types'
import type { AppScreens, TAssetBundleId } from '@/screens/screens.types'
import { PopupSimpleMessage } from '@/popups/simple-message'

export class GameOver extends PopupSimpleMessage implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload']
  public definition: AppScreens = 'GameOver'
  constructor() {
    super('GAME OVER')
  }
}
