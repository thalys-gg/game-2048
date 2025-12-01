import { FlatGrid } from '∆/lib/flat-grid'


export class GameFlatGrid<T> extends FlatGrid<T> {


  public getRandomEmpty () {
    return this.getRandomLocation(value => value === null || value === undefined)
  }
}
