/**
 * Signature for resize events
 */
export type ResizeSignature = {
  /** The screen dimensions */
  screen: { width: number; height: number }
  /** The parent container dimensions */
  parent: { width: number; height: number }
}
