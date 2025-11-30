import type { Container } from 'pixi.js'

export interface IBaseOptions {
  minSize?: number
  gap?: number
}

export interface IDistributionOptions extends IBaseOptions {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
}

export type ResultGetMaxDimensions = { children: Container[], childrenSize: { width: number, height: number } }
