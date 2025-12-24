import { describe, expect, test } from 'bun:test'
import { FlatGrid } from './flat-grid'

describe('FlatGrid', () => {
  describe('Constructor', () => {
    test('should initialize with correct dimensions', () => {
      const grid = new FlatGrid(10, 5)
      expect(grid.width).toBe(10)
      expect(grid.height).toBe(5)
      expect(grid.raw.length).toBe(50)
    })

    test('should initialize with default value (null)', () => {
      const grid = new FlatGrid(2, 2)
      // data should be filled with null by default if we consider the implementation
      // The implementation says: this.data = new Array(...)
      // if initialValue is undefined, it doesn't loop filling.
      // Wait, let's check the code:
      // if (initialValue !== undefined) { ... } else { /* no fill, just new Array */ }
      // Actually, `new Array(n)` creates empty slots. But `get` returns `fallback` which defaults to `null`.
      // Let's check `getAtIndex`. `return this.data[index] || null`.
      // So effectively it behaves like null.
      expect(grid.get(0, 0)).toBeNull()
    })

    test('should initialize with specific value', () => {
      const grid = new FlatGrid<number>(2, 2, 0)
      expect(grid.get(0, 0)).toBe(0)
      expect(grid.get(1, 1)).toBe(0)
    })

    test('should initialize with generator function', () => {
      const grid = new FlatGrid<number>(2, 2, index => index)
      expect(grid.get(0, 0)).toBe(0) // index 0
      expect(grid.get(1, 0)).toBe(1) // index 1
      expect(grid.get(0, 1)).toBe(2) // index 2
      expect(grid.get(1, 1)).toBe(3) // index 3
    })
  })

  describe('Indexing & Coordinates', () => {
    const grid = new FlatGrid(10, 5) // 10x5 grid

    test('getIndex should return correct 1D index', () => {
      expect(grid.getIndex(0, 0)).toBe(0)
      expect(grid.getIndex(9, 0)).toBe(9)
      expect(grid.getIndex(0, 1)).toBe(10)
      expect(grid.getIndex(9, 4)).toBe(49)
    })

    test('getXY should return correct 2D coordinates', () => {
      expect(grid.getXY(0)).toEqual({ x: 0, y: 0 })
      expect(grid.getXY(9)).toEqual({ x: 9, y: 0 })
      expect(grid.getXY(10)).toEqual({ x: 0, y: 1 })
      expect(grid.getXY(49)).toEqual({ x: 9, y: 4 })
    })

    test('isValid should correctly validate coordinates', () => {
      expect(grid.isValid(0, 0)).toBe(true)
      expect(grid.isValid(9, 4)).toBe(true)
      expect(grid.isValid(-1, 0)).toBe(false)
      expect(grid.isValid(0, -1)).toBe(false)
      expect(grid.isValid(10, 0)).toBe(false)
      expect(grid.isValid(0, 5)).toBe(false)
    })

    test('isValidIndex should correctly validate indices', () => {
      expect(grid.isValidIndex(0)).toBe(true)
      expect(grid.isValidIndex(49)).toBe(true)
      expect(grid.isValidIndex(-1)).toBe(false)
      expect(grid.isValidIndex(50)).toBe(false)
    })
  })

  describe('Data Access & Modification', () => {
    // Setup a grid for testing
    // 0 1 2
    // 3 4 5
    const createGrid = () => new FlatGrid<number>(3, 2, i => i)

    test('get/set should work for valid coordinates', () => {
      const grid = createGrid()
      expect(grid.get(0, 0)).toBe(0)
      expect(grid.get(2, 1)).toBe(5)

      expect(grid.set(0, 0, 99)).toBe(true)
      expect(grid.get(0, 0)).toBe(99)
    })

    test('get/set should fail/return fallback for invalid coordinates', () => {
      const grid = createGrid()
      expect(grid.get(3, 0)).toBeNull()
      expect(grid.get(3, 0, -1)).toBe(-1)
      expect(grid.set(3, 0, 99)).toBe(false)
    })

    test('getAtIndex/setAtIndex should work', () => {
      const grid = createGrid()
      expect(grid.getAtIndex(5)).toBe(5)
      expect(grid.setAtIndex(5, 100)).toBe(true)
      expect(grid.getAtIndex(5)).toBe(100)
    })

    test('getColumn should return correct column', () => {
      const grid = createGrid()
      // 0 1 2
      // 3 4 5
      expect(grid.getColumn(1)).toEqual([1, 4])
    })

    test('getLine should return correct row', () => {
      const grid = createGrid()
      // 0 1 2
      // 3 4 5
      expect(grid.getLine(1)).toEqual([3, 4, 5])
    })
  })

  describe('Neighborhood Utils', () => {
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const grid = new FlatGrid<number>(3, 3, i => i)

    test('getNeighbors should return 4 neighbors (no diagonals)', () => {
      // Center (1,1) -> 4
      // Neighbors: 1(N), 5(E), 7(S), 3(W)
      const neighbors = grid.getNeighbors(1, 1, false)
      expect(neighbors).toHaveLength(4)
      const values = neighbors.map(n => n.value).sort((a, b) => (a as number) - (b as number))
      expect(values).toEqual([1, 3, 5, 7])
    })

    test('getNeighbors should return 8 neighbors (with diagonals)', () => {
      // Center (1,1) -> 4
      // Neighbors: All others
      const neighbors = grid.getNeighbors(1, 1, true)
      expect(neighbors).toHaveLength(8)
      const values = neighbors.map(n => n.value).sort((a, b) => (a as number) - (b as number))
      expect(values).toEqual([0, 1, 2, 3, 5, 6, 7, 8])
    })

    test('getNeighbors should handle boundaries/corners', () => {
      // Top-Left (0,0) -> 0
      // Neighbors (no diag): 1(E), 3(S)
      const neighbors = grid.getNeighbors(0, 0, false)
      expect(neighbors).toHaveLength(2)
      expect(neighbors.map(n => n.value)).toContain(1)
      expect(neighbors.map(n => n.value)).toContain(3)

      // Top-Left (0,0) -> 0
      // Neighbors (diag): 1(E), 3(S), 4(SE)
      const neighborsDiag = grid.getNeighbors(0, 0, true)
      expect(neighborsDiag).toHaveLength(3)
      expect(neighborsDiag.map(n => n.value)).toContain(4)
    })
  })

  describe('Functional Methods', () => {
    test('forEach should iterate all cells', () => {
      const grid = new FlatGrid(2, 2, 0)
      let count = 0
      grid.forEach((_, x, y) => {
        expect(x).toBeGreaterThanOrEqual(0)
        expect(y).toBeGreaterThanOrEqual(0)
        count++
      })
      expect(count).toBe(4)
    })

    test('includes should return true/false correctly', () => {
      const grid = new FlatGrid<number>(3, 3, 0)
      grid.set(1, 1, 99)
      expect(grid.includes(99)).toBe(true)
      expect(grid.includes(100)).toBe(false)
    })

    test('includes should handle null values correctly', () => {
      const grid = new FlatGrid<number>(2, 2, null)
      expect(grid.includes(null)).toBe(true)
      grid.set(0, 0, 0)
      expect(grid.includes(0)).toBe(true)
      expect(grid.includes(null)).toBe(true)
    })

    test('map should return a new grid with transformed values', () => {
      const grid = new FlatGrid(2, 2, 1)
      const doubled = grid.map(val => (val as number) * 2)

      expect(doubled).not.toBe(grid) // Reference check
      expect(doubled.get(0, 0)).toBe(2)
      expect(grid.get(0, 0)).toBe(1) // Original unchanged
    })

    test('fill should fill the grid', () => {
      const grid = new FlatGrid(2, 2, 0)
      grid.fill(5)
      expect(grid.get(0, 0)).toBe(5)
      expect(grid.get(1, 1)).toBe(5)
    })

    test('getRandomLocation should find a location matching predicate', () => {
      const grid = new FlatGrid<number>(3, 3, 0)
      grid.set(0, 0, 1)
      grid.set(1, 1, 1)
      grid.set(2, 2, 1)

      // Test multiple times to account for randomness
      for (let i = 0; i < 10; i++) {
        const loc = grid.getRandomLocation(val => val === 1)
        expect(loc).not.toBeNull()
        expect(grid.get(loc!.x, loc!.y)).toBe(1)
      }

      const notFound = grid.getRandomLocation(val => val === 99)
      expect(notFound).toBeNull()
    })
  })

  describe('Utility', () => {
    test('clone should create a copy', () => {
      const grid = new FlatGrid<number>(2, 2, 1)
      const clone = grid.clone()

      expect(clone).not.toBe(grid)
      expect(clone.get(0, 0)).toBe(1)

      clone.set(0, 0, 99)
      expect(clone.get(0, 0)).toBe(99)
      expect(grid.get(0, 0)).toBe(1) // Original unaffected
    })

    test('setRawData should replace data and validate length', () => {
      const grid = new FlatGrid<number>(2, 2)
      const validData = [1, 2, 3, 4]
      grid.setRawData(validData)
      expect(grid.get(0, 0)).toBe(1)
      expect(grid.get(1, 1)).toBe(4)

      const invalidData = [1, 2, 3]
      expect(() => grid.setRawData(invalidData)).toThrow()
    })

    test('from2DArray should create generic grid', () => {
      const matrix = [
        [1, 2],
        [3, 4],
      ]
      const grid = FlatGrid.from2DArray(matrix)
      expect(grid.width).toBe(2)
      expect(grid.height).toBe(2)
      expect(grid.get(0, 0)).toBe(1)
      expect(grid.get(1, 1)).toBe(4)
    })

    test('toString should return string representation', () => {
      const grid = new FlatGrid(2, 2, 0)
      expect(typeof grid.toString()).toBe('string')
    })
  })
})
