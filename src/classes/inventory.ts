import * as dotenv from 'dotenv'
import { OkPacket, RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { Bait } from './bait'
import { Rod } from './rod'
import { User } from './user'

dotenv.config()

export class Inventory {
  id: number;
  userID: number;
  itemID: number;
  qty: number;

  constructor (id: number, userID: number, itemID: number, qty: number) {
    this.id = id
    this.userID = userID
    this.itemID = itemID
    this.qty = qty
  }

  static getInventory = (user: User, item: Bait | Rod | undefined, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      let queryString = `
        SELECT i.id, i.userID, i.itemID, i.qty
        FROM inventory AS i
        WHERE i.userID = '${user.id}'`

      if (item) {
        queryString += `
        AND i.itemID = '${item.id}'`
      }

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const row = (<RowDataPacket> result)[0]
          if (row) {
            const inventory: Inventory = new Inventory(row.id, row.userID, row.itemID, row.qty)
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

  static createInventory = (user: User, item: Bait | Rod, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO inventory
        (userID, itemID, qty)
        VALUES(${user.id}, ${item.id}, 1);`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN3'); return }

          const insertId = (<OkPacket> result).insertId
          const newInventory: Inventory = new Inventory(insertId, user.id, item.id, 1)
          callback(null, newInventory)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLIN4'), undefined)
    }
  }

  static addInventory = (user: User, item: Bait | Rod, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        UPDATE inventory i
        SET i.qty = i.qty+1
        WHERE i.userID = ${user.id}
        AND i.itemID = ${item.id};`

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
    Inventory.getInventory(user, item, (err: Error, inv: Inventory) => {
      if (err && err.message.includes('No inventory found')) {
        Inventory.createInventory(user, item, (err: Error, newInv: Inventory) => {
          callback(err, inv)
        })
      } else if (err) {
        callback(err, inv)
      } else {
        Inventory.addInventory(user, item, (err: Error, updInv: Inventory) => {
          callback(err, inv)
        })
      }
    })
  }
}
