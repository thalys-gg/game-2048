import type { Label } from '@/ui/Label'
import { waitFor } from '@thalys/pixi-shared/lib/promise'
import { animate } from 'motion'

let _rollupScoreRef: ReturnType<typeof animate> | null = null
let _fadeScoreRef: ReturnType<typeof animate> | null = null

export default new (class {
  rollupScore = (text: Label, from: number, to: number) => {
    if (_rollupScoreRef) {
      _rollupScoreRef.complete()
      _rollupScoreRef = null
    }

    _rollupScoreRef = animate(from, to, {
      onUpdate: latest => {
        text.text = `${Math.round(latest)}`
      },
    })

    return {
      destroy: () => {
        _rollupScoreRef?.complete()
        _rollupScoreRef = null
      },
    }
  }

  fadeScore = (text: Label) => {
    if (_rollupScoreRef) {
      _rollupScoreRef.complete()
      _rollupScoreRef = null
    }

    if (_fadeScoreRef) {
      _fadeScoreRef.complete()
      _fadeScoreRef = null
    }

    ;(async () => {
      _fadeScoreRef = animate(text, { alpha: 0 }, { duration: 0.4 })
      await _fadeScoreRef

      await waitFor(0.15)
      text.text = '0'
      await waitFor(0.15)

      _fadeScoreRef = animate(text, { alpha: 1 }, { duration: 0.4 })
      await _fadeScoreRef
    })()

    return {
      destroy: () => {
        _fadeScoreRef?.complete()
        _fadeScoreRef = null
      },
    }
  }
})()
