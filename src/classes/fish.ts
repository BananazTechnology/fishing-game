import { RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'

export class Fish {
  public id: number;
  public name: string;
  public rarity: string;
  public description: string;
  public points: number;
  public quantity: number;
  public image: string;

  constructor (id: number, name: string, rarity: string, description: string, points: number, quantity: number, image: string) {
    this.id = id
    this.name = name
    this.quantity = quantity
    this.description = description
    this.rarity = rarity
    this.points = points
    this.image = image
  }

  static getFish = (callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT f.id, f.name
        FROM fish AS f`

      if (db) {
        //console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const fishList: Fish[] = []

            rows.forEach(row => {
              fishList.push(new Fish(row.id, row.name, '', '', 0, 0, ''))
            })

            callback(null, fishList)
          } else {
            callback(new Error('No fish found'), undefined)
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

  static getByName = (name: string|undefined, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT f.id, f.name, f.description, f.image
        FROM fish AS f
        WHERE f.name = '${name}'`

      if (db) {
        //console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            callback(null, new Fish(rows[0].id, rows[0].name, '', rows[0].description, 0, 0, rows[0].image))
          } else {
            callback(new Error('No fish found'), undefined)
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
}
