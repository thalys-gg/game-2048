import type { AbstractSplitOptions, CanvasTextMetrics, Container } from 'pixi.js'

export type TSplitedInto = Container

export interface IFunctionSplitResult<T extends TSplitedInto> {
  /** Array of individual character Text objects */
  chars: T[]
  /** Array of word containers, each containing character objects */
  words: Container[]
  /** Array of line containers, each containing word containers */
  lines: Container[]
}

export interface ITextEmojiOptions extends AbstractSplitOptions {}

export interface Segment
{
  char: string
  metric: CanvasTextMetrics
}

export interface GroupedSegment
{
  line: string
  chars: Segment[]
  width: number
}
