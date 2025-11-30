import type { DisplayChild } from '@/fun-style/types'
import { PContainer } from '∆/rosetta-stone/PixiJS'
import { engine } from '@/getEngine'

export const display = () => {
  const { stage, screen: s, ticker } = engine()
  const container = new PContainer()

  const onDestroyList: DisplayChild[] = []

  container.on('destroyed', () => {
    onDestroyList.forEach((child) => {
      child?.onDestroy && child.onDestroy()
    })
  })

  const api = {

    start: () => api,

    add: (child: DisplayChild, parent?: DisplayChild) => {
      (parent ?? container).addChild(child)

      child.onInit && child.onInit()

      child.onResize && child.onResize({
        sw: s.width,
        sh: s.height,
      })

      child.onUpdate && ticker.add(child.onUpdate)

      child.onDestroy && onDestroyList.push(child)

      return api
    },

    container: () => {
      return container
    },

    addToStage: () => {
      stage.addChild(container)
      return api
    },
  }
  return api
}
