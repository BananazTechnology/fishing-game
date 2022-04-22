import * as dotenv from 'dotenv'
import { RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { Fish } from './fish'
import { Location } from './location'
import { User } from './user'

dotenv.config()

export class Log {
  id?: number;
  user?: User;
  fish?: Fish|String;
  location?: Location;
  count?: number;

  constructor (id: number|undefined, user: User|undefined, fish: Fish|undefined, location: Location|undefined, count: number|undefined) {
    this.id = id
    this.user = user
    this.fish = fish
    this.location = location
    this.count = count
  }

  static newLog = (user: User, fish: Fish, location: Location, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO catchLog
        (user, fish, location)
        VALUES(${user.id}, ${fish.id}, ${location.id});`

      if (db) {
        //console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, undefined); return }

          const newUser: User = new User(user.id, user.discordID, user.discordName, user.walletAddress, 10, undefined, undefined)
          callback(null, newUser)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('DB error'), undefined)
    }
  }

  static getUserCodex = (user: User, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT f.name, COUNT(cl.\`Date\`) as count 
        FROM fish f
        LEFT JOIN (
          SELECT cl2.fish, cl2.\`Date\`
          FROM catchLog cl2
          WHERE cl2.\`user\` = ${user.id}
        ) cl ON cl.fish = f.id
        GROUP BY f.id`

      if (db) {
        //console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, undefined); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const counts: Log[] = []

            rows.forEach(row => {
              counts.push(new Log(undefined, user, row.name, undefined, row.count))
            })

            callback(null, counts)
          } else {
            callback(new Error('No codex found'), undefined)
          }
        })

        db.end()
      } else {
        callback(new Error('No records found'), undefined)
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(new Error('DB Connection Issue'), undefined)
    }
  }

  static getFishCount (user: User, fishID: number): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const db = FishGameDB.getConnection()

        const queryString = `
          SELECT COUNT(*) as count 
          FROM catchLog cl
          WHERE cl.\`user\` = ${user.id}
          AND cl.fish = ${fishID}`

        if (db) {
          //console.debug(queryString)
          db.query(queryString, (err, result) => {
            if (err) { resolve(0); return }

            const rows = <RowDataPacket[]> result
            const row = rows[0]
            if (row) {
              resolve(row.count)
            } else {
              resolve(0)
            }
          })

          db.end()
        } else {
          resolve(0)
        }
      } catch {
        console.debug('DB Connection Issue')
        resolve(0)
      }
    })
  }
}
