export type LineEntry<T> = {
  pawn: T
  fromX: number
  fromY: number
}

export type PawnSlide<T> = {
  pawn: T
  toX: number
  toY: number
}

export type PawnMerge<T> = {
  survivor: T
  merged: T
  toX: number
  toY: number
  newValue: number
}

export type LinePlan<T> = {
  slides: PawnSlide<T>[]
  merges: PawnMerge<T>[]
  cells: (T | null)[]
}

export type MovePlan<T> = {
  moved: boolean
  slides: PawnSlide<T>[]
  merges: PawnMerge<T>[]
  placements: { x: number; y: number; pawn: T }[]
}

/** Plans slide/merge events for a single row or column after compression. */
export function planLine<T extends { value: number }>(
  entries: LineEntry<T>[],
  destCells: { x: number; y: number }[],
): LinePlan<T> {
  const slides: PawnSlide<T>[] = []
  const merges: PawnMerge<T>[] = []
  const cells: (T | null)[] = []

  let slot = 0
  let i = 0

  while (i < entries.length) {
    const dest = destCells[slot]
    if (!dest) break

    if (i + 1 < entries.length && entries[i].pawn.value === entries[i + 1].pawn.value) {
      const survivor = entries[i].pawn
      const merged = entries[i + 1].pawn
      const fromSurvivor = entries[i]
      const fromMerged = entries[i + 1]

      if (fromSurvivor.fromX !== dest.x || fromSurvivor.fromY !== dest.y) {
        slides.push({ pawn: survivor, toX: dest.x, toY: dest.y })
      }
      if (fromMerged.fromX !== dest.x || fromMerged.fromY !== dest.y) {
        slides.push({ pawn: merged, toX: dest.x, toY: dest.y })
      }

      merges.push({
        survivor,
        merged,
        toX: dest.x,
        toY: dest.y,
        newValue: survivor.value * 2,
      })

      cells[slot] = survivor
      slot++
      i += 2
    } else {
      const entry = entries[i]

      if (entry.fromX !== dest.x || entry.fromY !== dest.y) {
        slides.push({ pawn: entry.pawn, toX: dest.x, toY: dest.y })
      }

      cells[slot] = entry.pawn
      slot++
      i++
    }
  }

  while (cells.length < destCells.length) {
    cells.push(null)
  }

  return { slides, merges, cells }
}