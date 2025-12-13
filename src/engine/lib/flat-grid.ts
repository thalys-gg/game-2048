/**
 * FlatGrid
 * A robust TypeScript implementation of a 2D grid stored in a 1D array (row-major order).
 * Advantages over T[][]:
 * 1. Memory locality / Cache friendly.
 * 2. Easier to serialize/deserialize (just one array).
 * 3. Easier to copy/clone.
 * 4. Constant time access O(1).
 */

export interface Coordinate {
  x: number
  y: number
}

export type GridIterator<T> = (value: T | null, x: number, y: number, index: number) => void
export type GridMapper<T, U> = (value: T | null, x: number, y: number, index: number) => U

export class FlatGrid<T> {
  public readonly width: number
  public readonly height: number
  protected data: (T | null)[]

  /**
   * @param width The width of the grid (columns)
   * @param height The height of the grid (rows)
   * @param initialValue Initial value to fill the grid, or a function that returns the value
   */
  constructor (width: number, height: number, initialValue?: T | ((index: number) => T)) {
    this.width = Math.floor(width)
    this.height = Math.floor(height)
    // eslint-disable-next-line unicorn/no-new-array
    this.data = new Array(this.width * this.height)

    if (initialValue !== undefined) {
      if (typeof initialValue === 'function') {
        for (let i = 0; i < this.data.length; i++) {
          this.data[i] = (initialValue as (index: number) => T)(i)
        }
      } else {
        this.data.fill(initialValue || null)
      }
    }
  }

  /**
   * Get value at (x, y). Returns null (or provided fallback) if out of bounds.
   */
  public get (x: number, y: number, fallback: T | null = null): T | null {
    if (!this.isValid(x, y)) return fallback
    return this.data[this.getIndex(x, y)]
  }

  /**
   * Converts 2D coordinates to a 1D index.
   * Does NOT check bounds (use isValid for that).
   */
  public getIndex (x: number, y: number): number {
    return y * this.width + x
  }

  /**
   * Get value directly by 1D index
   *
   * @param index The 1D index to get
   * @returns The value at the given index, or null if out of bounds
   */
  public getAtIndex (index: number): T | null {
    return this.data[index] || null
  }

  /**
   * Converts a 1D index to 2D coordinates
   * Does NOT check bounds (use isValid for that)
   *
   * @param index The 1D index to convert
   * @returns The 2D coordinates (x, y)
   */
  public getXY (index: number): Coordinate {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width),
    }
  }

  /**
   * Returns the column at the given x coordinate.
   * @param x The x coordinate of the column.
   * @returns The column as an array of values.
   */
  public getColumn (x: number): (T | null)[] {
    return Array.from(
      { length: this.height },
      (_, y) => this.get(x, y),
    )
  }

  /**
   * Returns the row at the given y coordinate.
   * @param y The y coordinate of the row.
   * @returns The row as an array of values.
   */
  public getLine (y: number): (T | null)[] {
    return Array.from(
      { length: this.width },
      (_, x) => this.get(x, y),
    )
  }


  /**
   * Checks if coordinates are within grid boundaries.
   */
  public isValid (x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  /**
   * Checks if a 1D index is within bounds.
   */
  public isValidIndex (index: number): boolean {
    return index >= 0 && index < this.data.length
  }

  /**
   * Set value at (x, y). Returns false if out of bounds.
   */
  public set (x: number, y: number, value: T | null): boolean {
    if (!this.isValid(x, y)) return false
    this.data[this.getIndex(x, y)] = value
    return true
  }

  /**
   * Set value directly at 1D index.
   */
  public setAtIndex (index: number, value: T | null): boolean {
    if (!this.isValidIndex(index)) return false
    this.data[index] = value
    return true
  }

  public get raw (): (T | null)[] {
    return this.data
  }

  // ==========================================
  // Neighborhood Utils
  // ==========================================

  /**
   * Returns all valid neighbors surrounding a cell.
   * @param x The x coordinate of the cell.
   * @param y The y coordinate of the cell.
   * @param diagonals If true, includes corners (8 neighbors), otherwise just NESW (4 neighbors).
   */
  public getNeighbors (x: number, y: number, diagonals: boolean = false): { x: number, y: number, value: T | null, index: number }[] {
    const results = []

    // N, E, S, W
    const offsets = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ]

    if (diagonals) {
      offsets.push(
        { dx: -1, dy: -1 }, // NW
        { dx: 1, dy: -1 },  // NE
        { dx: 1, dy: 1 },   // SE
        { dx: -1, dy: 1 },   // SW
      )
    }

    for (const { dx, dy } of offsets) {
      const nx = x + dx
      const ny = y + dy

      if (this.isValid(nx, ny)) {
        const idx = this.getIndex(nx, ny)
        results.push({
          x: nx,
          y: ny,
          value: this.data[idx],
          index: idx,
        })
      }
    }

    return results
  }

  // ==========================================
  // Functional Methods
  // ==========================================

  public forEach (callback: GridIterator<T>): void {
    for (let i = 0; i < this.data.length; i++) {
      const { x, y } = this.getXY(i)
      callback(this.getAtIndex(i), x, y, i)
    }
  }

  /**
   * Returns a NEW FlatGrid with the mapped values.
   */
  public map<U>(callback: GridMapper<T, U>): FlatGrid<U> {
    const newGrid = new FlatGrid<U>(this.width, this.height)
    for (let i = 0; i < this.data.length; i++) {
      const { x, y } = this.getXY(i)
      newGrid.setAtIndex(i, callback(this.getAtIndex(i), x, y, i))
    }
    return newGrid
  }

  /**
   * Finds a random coordinate that matches the given predicate.
   * Useful for finding random empty cells for spawning.
   * @param predicate Function that returns true if the cell is a candidate
   * @returns A random Coordinate among the matches, or null if none found
   * @example
   * // Find random cell where value is 0
   * const emptySpot = grid.getRandomLocation((val) => val === 0);
   */
  public getRandomLocation (predicate: (value: T | null, x: number, y: number) => boolean): Coordinate | null {
    const indices: number[] = []

    // Single pass scan to find all candidates
    for (let i = 0; i < this.data.length; i++) {
      // Calculate coords manually to avoid object allocation overhead during scan
      const x = i % this.width
      const y = Math.floor(i / this.width)

      if (predicate(this.getAtIndex(i), x, y)) {
        indices.push(i)
      }
    }

    if (indices.length === 0) return null

    const randIndex = indices[Math.floor(Math.random() * indices.length)]
    return this.getXY(randIndex)
  }

  public fill (value: T | null): void {
    this.data.fill(value)
  }

  // ==========================================
  // Utility
  // ==========================================

  /**
   * Deep copy if T is primitive, shallow copy of references if T is object.
   */
  public clone (): FlatGrid<T> {
    const newGrid = new FlatGrid<T>(this.width, this.height)
    newGrid.setRawData([...this.data])
    return newGrid
  }

  /**
   * Replaces internal data buffer.
   * Useful for loading saved states.
   * Throws if length doesn't match dimensions.
   */
  public setRawData (newData: (T | null)[]): void {
    if (newData.length !== this.width * this.height) {
      throw new Error(`Data length ${newData.length} does not match grid dimensions ${this.width}x${this.height}`)
    }
    this.data = newData
  }

  /**
   * Debug visualization
   */
  public toString (): string {
    let output = ''
    for (let y = 0; y < this.height; y++) {
      const rowStart = y * this.width
      const rowEnd = rowStart + this.width
      output += `[ ${this.data.slice(rowStart, rowEnd).join(', ')} ]\n`
    }
    return output
  }

  /**
   * Static helper to create a grid from a 2D array (T[][]).
   */
  public static from2DArray<T>(matrix: T[][]): FlatGrid<T> {
    if (matrix.length === 0) return new FlatGrid<T>(0, 0)
    const height = matrix.length
    const width = matrix[0].length
    const grid = new FlatGrid<T>(width, height)

    matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        grid.set(x, y, val)
      })
    })

    return grid
  }
}
