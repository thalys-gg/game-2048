import { logger } from '@thalys/logger'
import { Assets, Container, Sprite, Texture } from 'pixi.js'
import { engine } from '@/getEngine'

export async function testPixiLayout () {
  const { stage, screen } = engine()

  stage.layout = {
    width: screen.width,
    height: screen.height,
    justifyContent: 'center',
    alignItems: 'center',
  }

  stage.addChild(await createContainer())
  stage.addChild(await testUIHearts())
}

async function createContainer () {
  const b = await Assets.loadBundle('memory-game-phaser')
  logger.info(b)

  const spritesheet = await Assets.load('memory-game-phaser/ui')
  const textures = spritesheet.textures

  // Create and add a container to the stage that will be used to hold the bunnies
  // The container will be centered in the stage and will have a gap of 10 pixels
  // between the bunnies
  // The container will also wrap the bunnies if there are too many to fit in a single row
  const container = new Container({
    layout: {
      width: '80%',
      height: '80%',
      gap: 4,
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
    },
  })

  for (let i = 0; i < 1000; i++) {
    const sprite = new Sprite({
      label: `heart${i}`,
      texture: Texture.from('heart'),
      layout: {},
    })
    container.addChild(sprite)
  }

  const container2 = new Container({ layout: {} })
  container2.addChild(container)

  return container2
}

async function testUIHearts () {
  const b = await Assets.loadBundle('memory-game-phaser')

  const container = new Container({
    layout: {
      width: '80%',
      height: '80%',
      gap: 4,
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
      borderColor: 'red',
    },
  })

  return container
}
