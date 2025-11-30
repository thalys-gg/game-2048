import type { AbstractSplitTextOptions, DestroyOptions, PointData, TextStyleOptions } from 'pixi.js'
import type { IFunctionSplitResult, TSplitedInto } from '@/engine/scene/text.types'
import { Container, TextStyle } from 'pixi.js'

export abstract class AbstractSplitText<T extends TSplitedInto> extends Container {
  /**
   * Individual graphemes from the text provided
   */
  public chars: T[]

  /**
   * Word segments of the text, each containing one or more characters
   */
  public words: Container[]

  /**
   * Line segments of the text, each containing one or more words
   */
  public lines: Container[]

  protected _originalText: string
  protected _lineAnchor: number | PointData
  protected _wordAnchor: number | PointData
  protected _charAnchor: number | PointData
  protected _autoSplit: boolean

  protected _style: TextStyle

  protected _dirty: boolean = false
  protected _canReuseChars: boolean = false

  constructor (config: AbstractSplitTextOptions) {
    const {
      text,
      style,
      autoSplit,
      lineAnchor,
      wordAnchor,
      charAnchor,
      ...options
    } = config

    super(options)
    this.chars = []
    this.words = []
    this.lines = []

    this._originalText = text
    this._autoSplit = autoSplit ?? true
    this._lineAnchor = lineAnchor ?? 0
    this._wordAnchor = wordAnchor ?? 0
    this._charAnchor = charAnchor ?? 0

    // setting the style will segment the text if autoSplit is true
    this.style = style
  }

  protected abstract splitFn (): IFunctionSplitResult<T>

  public split (): void {
    const res: IFunctionSplitResult<T> = this.splitFn()

    this.chars = res.chars
    this.words = res.words
    this.lines = res.lines

    this.addChild(...this.lines)

    // force origin to be set
    this.charAnchor = this._charAnchor
    this.wordAnchor = this._wordAnchor
    this.lineAnchor = this._lineAnchor

    this._dirty = false
    this._canReuseChars = true
  }

  get text (): string {
    return this._originalText
  }

  set text (value: string) {
    this._originalText = value
    this.lines.forEach(line => line.destroy({ children: true }))
    this.lines.length = 0
    this.words.length = 0
    this.chars.length = 0
    this._canReuseChars = false
    // You can't reuse chars if the text changes
    this.onTextUpdate()
  }

  private _setOrigin (
    value: number | PointData,
    elements: Array<Container>,
    property: '_lineAnchor' | '_wordAnchor' | '_charAnchor',
  ): void {
    let originPoint: PointData

    if (typeof value === 'number') {
      originPoint = { x: value, y: value }
    } else {
      originPoint = { x: value.x, y: value.y }
    }

    elements.forEach((element) => {
      const localBounds = element.getLocalBounds()

      // Calculate origin position relative to the bounds
      const originX = localBounds.minX + (localBounds.width * originPoint.x)
      const originY = localBounds.minY + (localBounds.height * originPoint.y)

      element.origin.set(originX, originY)
    })

    this[property] = value
  }

  get lineAnchor (): number | PointData {
    return this._lineAnchor
  }

  set lineAnchor (value: number | PointData) {
    this._setOrigin(value, this.lines, '_lineAnchor')
  }

  get wordAnchor (): number | PointData {
    return this._wordAnchor
  }

  set wordAnchor (value: number | PointData) {
    this._setOrigin(value, this.words, '_wordAnchor')
  }

  get charAnchor (): number | PointData {
    return this._charAnchor
  }

  set charAnchor (value: number | PointData) {
    this._setOrigin(value, this.chars, '_charAnchor')
  }

  get style (): TextStyle {
    return this._style
  }

  set style (style: TextStyle | Partial<TextStyle> | TextStyleOptions) {
    style ||= {}

    this._style = new TextStyle(style)

    // tidy up word/line containers, characters can be reused
    this.words.forEach(word => word.destroy())
    this.words.length = 0

    this.lines.forEach(line => line.destroy())
    this.lines.length = 0

    this._canReuseChars = true

    this.onTextUpdate()
  }

  protected onTextUpdate (): void {
    this._dirty = true
    this._autoSplit && this.split()
  }

  /**
   * Destroys the instance and all its resources.
   * Cleans up all segment arrays, event listeners, and optionally the text style.
   * @param options - Destroy configuration options
   * @example
   * ```ts
   * // Clean up everything
   * text.destroy({ children: true, texture: true, style: true });
   *
   * // Remove from parent but keep style
   * text.destroy({ children: true, style: false });
   * ```
   */
  public override destroy (options?: DestroyOptions): void {
    super.destroy(options)
    this.chars.length = 0
    // @ts-expect-error throwing away reference
    this.chars = null
    this.words.length = 0
    // @ts-expect-error throwing away reference
    this.words = null
    this.lines.length = 0
    // @ts-expect-error throwing away reference
    this.lines = null
    if (typeof options === 'boolean' ? options : options?.style) {
      this._style.destroy(options)
    }
    // @ts-expect-error throwing away reference
    this._style = null
    this._originalText = ''
  }
}
