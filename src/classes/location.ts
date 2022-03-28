import { RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { Fish } from './fish'

export class Location {
  public id: number;
  public name: string;
  public fish: Fish[] = []
  public total: number = 0

  constructor (id: number, name: string) {
    this.id = id
    this.name = name
  }

  static getLocation = (channelID: string, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT l.name AS location, l.id AS locationID, f.name as fish, f.id AS fishID, lfs.quantity
        FROM locations l
        JOIN locationFishStock AS lfs ON l.id = lfs.location
        JOIN fish AS f ON lfs.fish = f.id
        WHERE l.channelID = ${channelID}`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'DB Connection Issue'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const location: Location = new Location(rows[0].locationID, rows[0].location)

            rows.forEach(row => {
              location.fish.push(new Fish(row.fishID, row.fish, row.quantity))
              location.total += row.quantity
            })

            callback(null, location)
          } else {
            callback(new Error('No location found'), undefined)
          }
        })

        db.end()
      } else {
        callback(new Error('DB Connection Error'), undefined)
      }
    } catch {
      callback(new Error('DB Connection Error'), undefined)
    }
  }
}
