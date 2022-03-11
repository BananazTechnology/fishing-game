import axios, { AxiosError } from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

export class User {
  id: number;
  discordID: string;
  discordName: string;
  walletAddress: string;

  constructor (id: number, discordID: string, discordName: string, walletAddress: string) {
    this.id = id
    this.discordID = discordID
    this.discordName = discordName
    this.walletAddress = walletAddress
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
        }
        callback(null, undefined)
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
}
