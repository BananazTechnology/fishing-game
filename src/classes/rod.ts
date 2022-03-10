export class Rod {
  private id: number;
  private model: string;
  private catchRate: number;

  constructor (id: number, model: string, catchRate: number) {
    this.id = id
    this.model = model
    this.catchRate = catchRate
  }
}
