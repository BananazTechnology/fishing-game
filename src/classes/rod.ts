import { OkPacket } from 'mysql2'
import { Util } from '../util'
import { FishGameDB } from '../database/db'
import { StoreItem } from '../interfaces/storeItem'

export class Rod implements StoreItem {
  id: number;
  object: string;
  type: string;
  catchRate: number;
  cost: number;
  qty?: number;

  constructor (id: number, object: string, type: string, catchRate: number, cost: number, qty?: number) {
    this.id = id
    this.object = object
    this.type = type
    this.catchRate = catchRate
    this.cost = cost
    this.qty = qty
  }

  static createRod = (type: string, catchRate: number, cost: number, callback: Function) => {
    try {
      type = Util.checkString(type)

      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO items
        (object, type, catchRate, cost)
        VALUES('rod', ${type}, ${catchRate}, ${cost});`

      console.debug(queryString)

      if (db) {
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLRO1'); return }

          const insertId = (<OkPacket> result).insertId
          console.log(result)
          callback(null, insertId)
        })

        db.end()
      }
    } catch {
      callback(null, 'Error Code: FG-SRCLRO2')
    }
  }
}
