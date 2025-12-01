const { log, min, max } = Math

/** Get the distance between a and b points */
export function getDistance (ax: number, ay: number, bx = 0, by = 0) {
  const dx = bx - ax
  const dy = by - ay
  return Math.sqrt(dx * dx + dy * dy)
}

/** Linear interpolation */
export function lerp (a: number, b: number, t: number) {
  return (1 - t) * a + t * b
}

/** Clamp a number to minimum and maximum values */
export function clamp (num: number, min: number = 0, max: number = 1) {
  return num <= min ? min : num >= max ? max : num
}


// logarithm with any base
export function logBase (b: number, x: number) {
  return log(x) / log(b)
}
