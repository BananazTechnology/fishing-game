import { Fish } from './fish'

export class Location {
  private id: number;
  private name: string;
  private availableFish: Fish[];

  constructor (id: number, name: string, availableFish: Fish[] = Array(0)) {
    this.id = id
    this.name = name
    this.availableFish = availableFish
  }
}
