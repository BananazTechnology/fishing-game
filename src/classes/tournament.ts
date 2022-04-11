import * as dotenv from 'dotenv'
import { RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'
import { Fish } from './fish'
import { Log } from './log'
import { User } from './user'

dotenv.config()

export class Tournament {
  id?: number;
  start?: Date;
  end?: Date;
  fish?: Fish;

  constructor (id: number|undefined, start: Date|undefined, end: Date|undefined, fish: Fish|undefined) {
    this.id = id
    this.start = start
    this.end = end
    this.fish = fish
  }

  static newTournament = (start: Date, end: Date, fish: Fish, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO tournaments
        (start, end, fish)
        VALUES('${start.toISOString().slice(0, 19).replace('T', ' ')}', '${end.toISOString().slice(0, 19).replace('T', ' ')}', ${fish.id});`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, undefined); return }

          const newTournament: Tournament = new Tournament(0, start, end, fish)
          callback(null, newTournament)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('DB error'), undefined)
    }
  }

  static getLatest = (callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT t.id, t.\`start\`, t.\`end\`, t.fish
        FROM tournaments t 
        ORDER BY id DESC
        LIMIT 1`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const start = `${rows[0].start}`.split(/[- :]/)
            const startDate = new Date(+start[3], getMonthFromString(start[1]), +start[2], +start[4] - 4, +start[5], +start[6])

            const end = `${rows[0].end}`.split(/[- :]/)
            const endDate = new Date(+end[3], getMonthFromString(end[1]), +end[2], +end[4] - 4, +end[5], +end[6])

            callback(null, new Tournament(rows[0].id, startDate, endDate, new Fish(rows[0].fish, '', '', '', 0, 0, '')))
          } else {
            callback(new Error('No tournament found'), undefined)
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

  static getLeaderboard = (tournament: Tournament, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT cl.\`user\`, COUNT(*) AS count
        FROM catchLog cl
        WHERE cl.fish = ${tournament.fish?.id}
        AND cl.Date >= '${tournament.start?.toISOString().slice(0, 19).replace('T', ' ')}'
        AND cl.Date <= '${tournament.end?.toISOString().slice(0, 19).replace('T', ' ')}'
        GROUP BY cl.\`user\`
        ORDER BY COUNT(*) DESC`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

          const rows = <RowDataPacket[]> result
          if (rows && rows.length > 0) {
            const counts: Log[] = []

            const len: number = rows.length
            let count = 0

            rows.forEach(row => {
              User.getUserByID(row.user, (err: Error, result: User) => {
                if (err) { callback(err, 'Error Code: FG-SRCLIN2'); return }

                counts.push(new Log(undefined, result, row.name, undefined, row.count))
                count++

                if (count === len) {
                  callback(null, counts)
                }
              })
            })
          } else {
            callback(null, [])
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

function getMonthFromString (mon: string) : number {
  const num = new Date(Date.parse(mon + ' 1, 2012')).getMonth()
  return num
}
