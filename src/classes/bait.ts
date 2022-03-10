export class Bait {
  private id: number;
  private type: string;
  private catchRate: number;

  constructor (id: number, type: string, catchRate: number) {
    this.id = id
    this.type = type
    this.catchRate = catchRate
  }
}
