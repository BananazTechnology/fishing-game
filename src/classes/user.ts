export class User {
  private id: number;
  private name: string;
  private balance: number;

  constructor (id: number, name: string, balance: number) {
    this.id = id
    this.name = name
    this.balance = balance
  }
}
