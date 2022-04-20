import { RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { StoreItem } from '../interfaces/storeItem'
import { Bait } from './bait'
import { Rod } from './rod'
import { Special } from './special'

export class Shop {
  items: StoreItem[] = [];

  static getShop = (callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT i.id, i.object, i.type, i.catchRate, i.cost, i.qty
        FROM items AS i
        WHERE i.cost >= 0`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS2'); return }

          const rows = <RowDataPacket[]> result
          if (rows) {
            const shop = new Shop()
            rows.forEach(row => {
              switch (row.object) {
                case 'rod': {
                  shop.items.push(new Rod(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                  break
                }
                case 'bait': {
                  shop.items.push(new Bait(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                  break
                }
                case 'special': {
                  shop.items.push(new Special(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                  break
                }
              }
            })
            callback(null, shop)
          } else {
            callback(null, undefined)
          }
        })
        db.end()
      } else {
        callback(null, undefined)
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(null, 'Error Code: FG-SRCLUS1')
    }
  }

  static getItem = (id: number, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT i.id, i.object, i.type, i.catchRate, i.cost, i.qty
        FROM items AS i
        WHERE i.id = ${id}`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS2'); return }

          const rows = <RowDataPacket[]> result
          if (rows) {
            const row = rows[0]
            switch (row.object) {
              case 'rod': {
                callback(null, new Rod(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                break
              }
              case 'bait': {
                callback(null, new Bait(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                break
              }
              case 'special': {
                callback(null, new Special(row.id, row.object, row.type, row.catchRate, row.cost, row.qty))
                break
              }
            }
          } else {
            callback(null, undefined)
          }
        })
        db.end()
      } else {
        callback(null, undefined)
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(null, 'Error Code: FG-SRCLUS1')
    }
  }
}
