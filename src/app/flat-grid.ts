import { FlatGrid } from '∆/lib/flat-grid'


export class GameFlatGrid<T> extends FlatGrid<T> {


  public getRandomEmpty () {
    return this.getRandomLocation(value => value === null || value === undefined)
  }

  public override clone (): GameFlatGrid<T> {
    const newGrid = new GameFlatGrid<T>(this.width, this.height)
    newGrid.setRawData([...this.data])
    return newGrid
  }
}
