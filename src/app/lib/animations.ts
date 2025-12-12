import type { Label } from '@/ui/Label'
import { animate } from 'motion'

let _rollupScoreRef: ReturnType<typeof animate> | null = null

export default new class {
  rollupScore = (text: Label, from: number, to: number) => {

    if (_rollupScoreRef) {
      _rollupScoreRef.complete()
      _rollupScoreRef = null
    }

    _rollupScoreRef = animate(from, to, {
      onUpdate: (latest) => {
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
}()
