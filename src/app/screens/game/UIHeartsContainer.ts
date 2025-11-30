import { logger } from '@thalys/logger'
import { Container } from 'pixi.js'
import { UIHeart } from '@/screens/game/UIHeart.ts'

export class UIHeartsContainer extends Container {
  private _hearts: UIHeart[] = []
  constructor () {
    super()
  }

  public prepare (lives: number) {
    this._hearts = []
    for (let i = 0; i < lives; i++) {
      const heart = new UIHeart(i)
      this._hearts.push(heart)
      this.addChild(heart)
      heart.animateIn()
    }
  }

  public updateHearts = () => {
    const heartToRemove = this._hearts.pop()
    heartToRemove?.animateOut()
  }

  public resize (width: number, height: number) {

  }
}
