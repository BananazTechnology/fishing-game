export class Fish {
  public id: number;
  public name: string;
  public rarity: string;
  public description: string;
  public points: number;
  public quantity: number;

  constructor (id: number, name: string, rarity: string, description: string, points: number, quantity: number) {
    this.id = id
    this.name = name
    this.quantity = quantity
    this.description = description
    this.rarity = rarity
    this.points = points
  }
}
