import type { IFunctionSplitResult, ITextEmojiOptions } from '∆/scene/text.types'
import type { Sprite, Text } from 'pixi.js'
import { AbstractSplitText } from '∆/scene/text.abstract'
import { textSplitWithEmojiReplacer } from '∆/scene/text.fn'
import { TextStyle } from 'pixi.js'

export interface TextEmojiParams extends Omit<ITextEmojiOptions, 'style'> {
  style?: ITextEmojiOptions['style']
}

export class TextEmoji extends AbstractSplitText<Text | Sprite> {

  /**
   * Default configuration options for TextEmoji instances.
   */
  public static defaultOptions: ITextEmojiOptions = {
    text: '',
    style: new TextStyle(),
    autoSplit: true, // Auto-update on text/style changes
    lineAnchor: 0, // Top-left alignment
    wordAnchor: 0, // Top-left alignment
    charAnchor: 0, // Top-left alignment
  }

  constructor (config: TextEmojiParams) {
    const options: ITextEmojiOptions = {
      ...TextEmoji.defaultOptions,
      ...config,
    }
    super(options)
  }

  /**
   * Creates a TextEmoji instance from an existing text object.
   * Useful for converting standard Text or Text objects into segmented versions.
   * @param text - The source text object to convert
   * @param options - Additional splitting options
   * @returns A new TextEmoji instance
   * @example
   */
  public static from (text: Text, options?: Omit<ITextEmojiOptions, 'text' | 'style'>): TextEmoji {
    const completeOptions: ITextEmojiOptions = {
      ...TextEmoji.defaultOptions,
      ...options,
      text: text.text,
      style: new TextStyle(text.style),
    }

    return new TextEmoji({
      ...completeOptions,
    })
  }

  protected splitFn (): IFunctionSplitResult<Text | Sprite> {
    const result = textSplitWithEmojiReplacer({
      text: this._originalText,
      style: this._style || new TextStyle(),
      chars: this._canReuseChars ? this.chars : [],
    })
    return result
  }
}
