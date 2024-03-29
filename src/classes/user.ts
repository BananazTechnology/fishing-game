import axios, { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import { OkPacket, RowDataPacket } from 'mysql2'
import { StoreItem } from 'src/interfaces/storeItem'
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
  lastFish?: number;

  constructor (id: number, discordID: string, discordName: string, walletAddress: string, balance?: number, activeRod?: number, activeBait?: number, lastFish?: number) {
    this.id = id
    this.discordID = discordID
    this.discordName = discordName
    this.walletAddress = walletAddress
    this.balance = balance
    this.activeRod = activeRod
    this.activeBait = activeBait
    this.lastFish = lastFish
  }

  static getUserByDiscordID = (discordID: string, callback: Function) => {
    const reqURL = `${process.env.userAPI}/user/getByDiscord/${discordID}`
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

  static getUserByID = (id: number, callback: Function) => {
    const reqURL = `${process.env.userAPI}/user/${id}`
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
        } else {
          callback(null, undefined)
        }
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

  static editUser = (id: number, discordID: string, discordName: string, walletAddress: string|undefined, callback: Function) => {
    const reqURL = `${process.env.userAPI}/user/${id}`
    console.log(`Request to UserAPI: PUT - ${reqURL}`)
    console.debug(`Data: { discordID: ${discordID}, discordName: ${discordName}, walletAddress: ${walletAddress} }`)
    axios
      .put(reqURL, { discordID, discordName, walletAddress })
      .then(res => {
        const data = res.data.data
        if (data) {
          const user: User = new User(data.id, data.discordID, data.discordName, data.walletAddress)
          callback(null, user)
        } else {
          callback(null, undefined)
        }
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
        SELECT u.id, u.balance, u.activeRod, u.activeBait, u.lastFish
        FROM users AS u
        WHERE u.id = '${user.id}'`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, 'Error Code: FG-SRCLUS2'); return }

          const row = (<RowDataPacket> result)[0]
          if (row) {
            const newUser: User = new User(user.id, user.discordID, user.discordName, user.walletAddress, row.balance, row.activeRod, row.activeBait, row.lastFish)
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

  static setLastFish = (user: User, lastFish: number, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()
      const queryString = `
        UPDATE users u
        SET u.lastFish = ${lastFish}
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

  static setActiveItem = (user: User, item: StoreItem|undefined, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()
      let queryString = ''

      if (item) {
        queryString = `
          UPDATE users u
          SET u.active${item.object} = ${item.id}
          WHERE u.id = ${user.id};`
      } else {
        queryString = `
          UPDATE users u
          SET u.activeBait = NULL
          WHERE u.id = ${user.id};`
      }

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

  static getCatchRate = (user: User, callback: Function) => {
    try {
      const db = FishGameDB.getConnection()

      const queryString = `
        SELECT SUM(i.catchRate) as rate
        FROM users u
        JOIN items i on ((i.id = u.activeBait) OR (i.id = u.activeRod))
        WHERE u.id = ${user.id}`

      if (db) {
        console.debug(queryString)
        db.query(queryString, (err, result) => {
          if (err) { callback(err, undefined); return }

          const row = (<RowDataPacket> result)[0]
          if (row) {
            callback(null, row.rate)
          } else {
            callback(null, 0)
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
}
