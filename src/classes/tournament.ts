import * as dotenv from 'dotenv'
import { FishGameDB } from '../database/db'
import { Fish } from './fish'

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
}
