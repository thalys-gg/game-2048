import { logger } from '@thalys/logger'
import gsap from 'gsap'
import { Container, Text, TextStyle } from 'pixi.js'
import { engine } from '@/getEngine'

export class MenuTitleText extends Container {
  style = new TextStyle({
    align: 'center',
    fontSize: 40,
    fill: '#8c7ae6',
    stroke: { color: '#ffffff', width: 4 },
  })

  text: Text | undefined

  constructor (onComplete: () => void) {
    super()

    this.text = this.createText()
    this.addChild(this.text)

    this.animateBlinking(this.text)

    this.text.on('pointerover', () => {
      if (this.text) {
        this.text.style.fill = '#9c88ff'
      }
    })
    this.text.on('pointerout', () => {
      if (this.text) {
        this.text.style.fill = '#8c7ae6'
      }
      else {
        throw new Error('`this.text` was undefined')
      }
    })
    this.text.on('pointerdown', () => {
      engine().audio.sfx.play('memory-game-phaser/audio/whoosh.mp3', { volume: 1.3 })
      if (!this.text) {
        logger.error('Text was invalid')
        return
      }

      gsap.killTweensOf(this.text)
      gsap.to(this.text, {
        alpha: 1,
        duration: 0.2,
      })
      gsap.to(this.text, {
        y: -200,
        duration: 0.5,
        ease: 'back.in',
        onComplete,
      })
    })
  }

  private createText () {
    const { screen } = engine()
    const { width, height } = screen

    const txt = new Text({
      text: 'Memory Card Game\nClick to Play',
      style: this.style,
    })

    txt.anchor.set(0.5)
    txt.position.set(width / 2, height / 2)
    txt.eventMode = 'static'
    txt.cursor = 'pointer'
    txt.alpha = 0

    return txt
  }

  private animateBlinking (text: Text) {
    gsap.to(text, {
      alpha: 1,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    })
  }
}
