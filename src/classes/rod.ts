export class Rod {
  private id: number;
  private model: string;
  private catchRate: number;
  private cost: number;

  constructor (id: number, model: string, catchRate: number, cost: number) {
    this.id = id
    this.model = model
    this.catchRate = catchRate
    this.cost = cost
  }
}
