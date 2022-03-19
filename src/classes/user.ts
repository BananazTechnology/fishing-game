import axios, { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import { OkPacket, RowDataPacket } from 'mysql2'
import { FishGameDB } from '../database/db'

dotenv.config()

export class User {
  id: number;
  discordID: string;
  discordName: string;
  walletAddress: string;
  balance?: number;
  activeRod?: number;
  activeBait?: number;

  constructor (id: number, discordID: string, discordName: string, walletAddress: string, balance?: number, activeRod?: number, activeBait?: number) {
    this.id = id
    this.discordID = discordID
    this.discordName = discordName
    this.walletAddress = walletAddress
    this.balance = balance
    this.activeRod = activeRod
    this.activeBait = activeBait
  }

  static getUserByDiscordID = (discordID: string, callback: Function) => {
    const reqURL = `${process.env.userAPI}/user/${discordID}`
    console.log(`Request to UserAPI: GET - ${reqURL}`)
    axios
      .get(reqURL)
      .then(res => {
        const data = res.data.data
        if (data) {
          const user: User = new User(data.id, data.discordID, data.discordName, data.walletAddress)
          callback(null, user)
          return
        }
        callback(new Error('No User Found'), undefined)
      })
      .catch(err => {
        console.error(err)
        callback(err, undefined)
      })
  }

  static createUser = (discordID: string, discordName: string, walletAddress: string|undefined, callback: Function) => {
    const reqURL = `${process.env.userAPI}/user`
    console.log(`Request to UserAPI: POST - ${reqURL}`)
    console.debug(`Data: { discordID: ${discordID}, discordName: ${discordName}, walletAddress: ${walletAddress} }`)
    axios
      .post(reqURL, { discordID, discordName, walletAddress })
      .then(res => {
        const data = res.data.data
        if (data) {
          const user: User = new User(data.id, data.discordID, data.discordName, data.walletAddress)
          callback(null, user)
        }
        callback(null, undefined)
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response.data.message)
        } else {
          console.error(err.message)
        }

        callback(err, undefined)
      })
  }

  static getFishGameUser = (user: User, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT u.id, u.balance, u.activeRod, u.activeBait
        FROM users AS u
        WHERE u.id = '${user.id}'`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS2'); return }

          const row = (<RowDataPacket> result)[0]
          if (row) {
            const newUser: User = new User(user.id, user.discordID, user.discordName, user.walletAddress, row.balance, row.activeRod, row.activeBait)
            callback(null, newUser)
          } else {
            callback(new Error('No user found'), undefined)
          }
        })

        db.end()
      } else {
        callback(null, 'Error Code: FG-SRCLUS5')
      }
    } catch {
      console.debug('DB Connection Issue')
      callback(null, 'Error Code: FG-SRCLUS1')
    }
  }

  static createFishGameUser = (user: User, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        INSERT INTO users
        (id, balance, activeRod, activeBait)
        VALUES(${user.id}, 10, null, null);`

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

  static setBalance = (user: User, balance: number, callback: Function) => {
    try {
      if (balance < 0) {
        callback(new Error('Not enough money'), undefined)
        return
      }

      const db = FishGameDB.getConnection()

      const queryString = `
        UPDATE users u
        SET u.balance = ${balance}
        WHERE u.id = ${user.id};`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS6'); return }

          const rows = (<OkPacket> result).changedRows
          callback(null, `Updated ${rows} rows`)
        })

        db.end()
      }
    } catch (e) {
      console.error(e)
      callback(new Error('Error Code: FG-SRCLUS7'), undefined)
    }
  }
}
