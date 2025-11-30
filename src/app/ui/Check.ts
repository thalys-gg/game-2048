import type { CheckBoxOptions } from '@pixi/ui'
import { CheckBox as PixiUICheckBox } from '@pixi/ui'

export type CheckOpts = CheckBoxOptions

export class Check extends PixiUICheckBox {
  constructor (opts: CheckBoxOptions) {
    super(opts)
    this.label = 'Check'
  }
}
