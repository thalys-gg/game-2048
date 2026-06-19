import type { IAppScreen } from '@thalys/pixi-shared/types'
import type { AppScreens, TAssetBundleId } from '@/screens/screens.types'
import { PopupSimpleMessage } from '@/popups/simple-message'

export class GameWon extends PopupSimpleMessage implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload']
  public definition: AppScreens = 'GameWon'
  constructor() {
    super('YOU WON!')
  }
}
