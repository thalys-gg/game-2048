import { describe, expect, it } from 'vitest'
import { planLine } from '@/lib/game-move-plan'

type MockPawn = { id: string; value: number }

function entry(id: string, value: number, fromX: number, fromY = 0) {
  return { pawn: { id, value }, fromX, fromY }
}

const rowDests = (y = 0) => [
  { x: 0, y },
  { x: 1, y },
  { x: 2, y },
  { x: 3, y },
]

describe('planLine', () => {
  it('slides a lone tile toward the move edge', () => {
    const plan = planLine([entry('a', 2, 3)], rowDests())

    expect(plan.slides).toEqual([{ pawn: { id: 'a', value: 2 }, toX: 0, toY: 0 }])
    expect(plan.merges).toEqual([])
    expect(plan.cells).toEqual([{ id: 'a', value: 2 }, null, null, null])
  })

  it('merges adjacent equal tiles into the leading cell', () => {
    const plan = planLine([entry('a', 2, 0), entry('b', 2, 1)], rowDests())

    expect(plan.slides).toEqual([{ pawn: { id: 'b', value: 2 }, toX: 0, toY: 0 }])
    expect(plan.merges).toEqual([
      {
        survivor: { id: 'a', value: 2 },
        merged: { id: 'b', value: 2 },
        toX: 0,
        toY: 0,
        newValue: 4,
      },
    ])
    expect(plan.cells[0]).toEqual({ id: 'a', value: 2 })
  })

  it('merges separated equal tiles into the leading cell', () => {
    const plan = planLine([entry('a', 2, 0), entry('b', 2, 2)], rowDests())

    expect(plan.slides).toEqual([{ pawn: { id: 'b', value: 2 }, toX: 0, toY: 0 }])
    expect(plan.merges).toHaveLength(1)
    expect(plan.cells).toEqual([{ id: 'a', value: 2 }, null, null, null])
  })

  it('merges two pairs in one line', () => {
    const plan = planLine(
      [entry('a', 2, 0), entry('b', 2, 1), entry('c', 2, 2), entry('d', 2, 3)],
      rowDests(),
    )

    expect(plan.merges).toHaveLength(2)
    expect(plan.cells[0]).toEqual({ id: 'a', value: 2 })
    expect(plan.cells[1]).toEqual({ id: 'c', value: 2 })
    expect(plan.cells[2]).toBeNull()
    expect(plan.cells[3]).toBeNull()
  })

  it('does not emit slides when nothing moves', () => {
    const plan = planLine([entry('a', 2, 0)], rowDests())

    expect(plan.slides).toEqual([])
    expect(plan.merges).toEqual([])
  })
})