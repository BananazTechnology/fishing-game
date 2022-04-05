import { OkPacket, RowDataPacket } from 'mysql2'
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
        SELECT l.name AS location, l.id AS locationID, f.name as fish, f.id AS fishID, f.description, f.image, lfs.quantity, fr.title as rarity, fr.points
        FROM locations l
        JOIN locationFishStock AS lfs ON l.id = lfs.location
        JOIN fish AS f ON lfs.fish = f.id
        JOIN fishRarity fr ON fr.id = f.rarity
        WHERE l.channelID = ${channelID}
        AND lfs.quantity > 0`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'DB Connection Issue'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const location: Location = new Location(rows[0].locationID, rows[0].location)

            rows.forEach(row => {
              location.fish.push(new Fish(row.fishID, row.fish, row.rarity, row.description, row.points, row.quantity, row.image))
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

  static restockLocations = (callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        UPDATE locationFishStock lfs 
        SET lfs.quantity = (
          SELECT fr.percentage*1000
          FROM fish f
          JOIN fishRarity fr ON fr.id = f.rarity
          WHERE lfs.fish = f.id
        );`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN6'); return }

          const rows = (<OkPacket> result).changedRows
          callback(null, `Updated ${rows} rows`)
        })

        db.end()
      }
    } catch {
      callback(new Error('DB Connection Error'), undefined)
    }
  }

  static fishCaught = (fish: Fish, location: Location, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        UPDATE locationFishStock lfs 
        SET lfs.quantity = lfs.quantity - 1
        WHERE lfs.location = ${location.id}
        AND lfs.fish = ${fish.id}`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN6'); return }

          const rows = (<OkPacket> result).changedRows
          callback(null, `Updated ${rows} rows`)
        })

        db.end()
      }
    } catch {
      callback(new Error('DB Connection Error'), undefined)
    }
  }
}
