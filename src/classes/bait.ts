export class Bait {
  private id: number;
  private type: string;
  private catchRate: number;
  private cost: number;

  constructor (id: number, type: string, catchRate: number, cost: number) {
    this.id = id
    this.type = type
    this.catchRate = catchRate
    this.cost = cost
  }
}
