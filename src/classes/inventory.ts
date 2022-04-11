import * as dotenv from 'dotenv'
import { OkPacket, RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { Bait } from './bait'
import { Rod } from './rod'
import { User } from './user'

dotenv.config()

export class Inventory {
  id?: number;
  userID: number;
  items: (Bait|Rod)[] = []

  constructor (id: number|undefined, userID: number, items: (Bait|Rod)[] = []) {
    this.id = id
    this.userID = userID
    this.items = items
  }

  static getInventory = (user: User, item: Bait | Rod | undefined, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      let queryString = `
        SELECT i.user, i.item, it.object, it.type, it.catchRate, it.cost, i.quantity
        FROM inventory AS i
        JOIN items AS it ON i.item = it.id
        WHERE i.user = ${user.id}`

      if (item) {
        queryString += `
        AND i.item = ${item.id}`
      }

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const inventory: Inventory = new Inventory(undefined, user.id)

            rows.forEach(row => {
              switch (row.object) {
                case 'rod': {
                  inventory.items.push(new Rod(row.item, row.object, row.type, row.catchRate, row.cost, row.quantity))
                  break
                }
                case 'bait': {
                  inventory.items.push(new Bait(row.item, row.object, row.type, row.catchRate, row.quantity, row.quantity))
                  break
                }
              }
            })

            callback(null, inventory)
          } else {
            callback(new Error('No inventory found'), undefined)
          }
        })

        db.end()
      } else {
        callback(null, 'Error Code: FG-SRCLIN5')
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(null, 'Error Code: FG-SRCLIN1')
    }
  }

  private static createInventory = (user: User, item: Bait | Rod, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO inventory
        (user, item, quantity)
        VALUES(${user.id}, ${item.id}, ${item.qty});`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN3'); return }

          const insertId = (<OkPacket> result).insertId
          callback(null, insertId)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLIN4'), undefined)
    }
  }

  private static addInventory = (user: User, item: Bait | Rod, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()
      const queryString = `
        UPDATE inventory i
        SET i.quantity = i.quantity+ ${item.qty}
        WHERE i.user = ${user.id}
        AND i.item = ${item.id};`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN6'); return }

          const rows = (<OkPacket> result).changedRows
          callback(null, `Updated ${rows} rows`)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLIN7'), undefined)
    }
  }

  static updateInventory (user: User, item: Bait | Rod, callback: Function) {
    console.log(`ITEM ID: ${item.id}`)
      switch(item.id){
        case 13:
          item.id = 5
          break
        case 14:
          item.id = 6
          break 
        case 15:
          item.id = 7
          break 
        case 16:
          item.id = 8
          break 
        default:
          break
      }
      console.log(`ITEM ID: ${item.id}`)
    Inventory.getInventory(user, item, (err: Error, inv: Inventory) => {
      if (err && err.message.includes('No inventory found')) {
        Inventory.createInventory(user, item, (err: Error, inv: Inventory) => {
          callback(err, inv)
        })
      } else if (err) {
        callback(err, inv)
      } else {
        Inventory.addInventory(user, item, (err: Error, inv: Inventory) => {
          callback(err, inv)
        })
      }
    })
  }
}
