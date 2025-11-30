export interface RulerOptions {
  majorTick: number
  minorTick: number
  microTick: number
  showLabels: { major: boolean, normal: boolean, minor: boolean }
  showCrosshair: boolean
  showHorizontal: boolean
  showVertical: boolean
  rulerColor: string
  labelColor: string
  backgroundColor: string
}
