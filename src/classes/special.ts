import { StoreItem } from '../interfaces/storeItem'

export class Special implements StoreItem {
  id: number;
  object: string;
  type: string;
  catchRate: number;
  cost: number;
  qty: number;

  constructor (id: number, object: string, type: string, catchRate: number, cost: number, qty?: number) {
    this.id = id
    this.object = object
    this.type = type
    this.catchRate = catchRate
    this.cost = cost
    qty ? this.qty = qty : this.qty = 0
  }
}
