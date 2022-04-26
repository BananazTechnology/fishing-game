import { OkPacket } from 'mysql2'
import { Util } from '../util'
import { FishGameDB } from '../database/db'
import { StoreItem } from '../interfaces/storeItem'
import { Inventory } from './inventory'
import { User } from './user'

export class Bait implements StoreItem {
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

  static createBait = (type: string, catchRate: number, cost: number, callback: Function) => {
    try {
      type = Util.checkString(type)

      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO items
        (object, type, catchRate, cost)
        VALUES('bait', ${type}, ${catchRate}, ${cost});`

      console.debug(queryString)

      if (db) {
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLBA1'); return }

          const insertId = (<OkPacket> result).insertId
          console.log(result)
          callback(null, insertId)
        })

        db.end()
      }
    } catch {
      callback(null, 'Error Code: FG-SRCLBA2')
    }
  }

  static useBait = (user: User, callback: Function) => {
    try {
      if (!user.activeBait) { return }
      Inventory.getInventory(user, user.activeBait, async (err: Error, result: Inventory) => {
        if (err) {
          callback(err, 'Bait Jar tipped over')
        } else if (result.items.length > 0 && result.items[0].qty === 1) {
          const db = FishGameDB.getConnection()

          const queryString1 = `
          DELETE FROM inventory i
          WHERE i.\`user\` = ${user.id}
          AND i.item = ${user.activeBait};`

          const queryString2 = `
          UPDATE users u
          SET u.activeBait = NULL
          WHERE u.id = ${user.id};`

          if (db) {
            console.debug(queryString1)
            db.query(queryString1, (err, result) => {
              if (err) { callback(err, 'Error Code: FG-SRCLUS6'); return }

              console.debug(queryString2)
              db.query(queryString2, (err, result) => {
                if (err) { callback(err, 'Error Code: FG-SRCLUS6'); return }

                const rows = (<OkPacket> result).changedRows
                callback(null, `Updated ${rows} rows`)
              })
            })

            db.end()
          }
        } else {
          const db = FishGameDB.getConnection()

          const queryString = `
          UPDATE inventory i
          SET i.quantity = i.quantity - 1
          WHERE i.\`user\` = ${user.id}
          AND i.item = ${user.activeBait};`

          if (db) {
            console.debug(queryString)
            db.query(queryString, (err, result) => {
              if (err) { callback(err, 'Error Code: FG-SRCLUS6'); return }

              const rows = (<OkPacket> result).changedRows
              callback(null, `Updated ${rows} rows`)
            })

            db.end()
          }
        }
      })
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLUS7'), undefined)
    }
  }
}
