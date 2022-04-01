import * as dotenv from 'dotenv'
import { FishGameDB } from '../database/db'
import { Fish } from './fish'
import { Location } from './location'
import { User } from './user'

dotenv.config()

export class Log {
  id: number;
  user: User;
  fish: Fish;
  location: Location;

  constructor (id: number, user: User, fish: Fish, location: Location) {
    this.id = id
    this.user = user
    this.fish = fish
    this.location = location
  }

  static newLog = (user: User, fish: Fish, location: Location, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO catchLog
        (user, fish, location)
        VALUES(${user.id}, ${fish.id}, ${location.id});`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS3'); return }

          const newUser: User = new User(user.id, user.discordID, user.discordName, user.walletAddress, 10, undefined, undefined)
          callback(null, newUser)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLUS4'), undefined)
    }
  }
}
