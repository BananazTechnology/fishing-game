import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

export class User {
  id: number;
  discordID: string;
  name: string;
  wallet: string;

  constructor (id: number, discordID: string, name: string, wallet: string) {
    this.id = id
    this.discordID = discordID
    this.name = name
    this.wallet = wallet
  }

  static getUserByDiscordID = (discordID: string, callback: Function) => {
    const reqURL = `${process.env.userAPI}/getuser/${discordID}`
    console.log(`Request to UserAPI: ${reqURL}`)
    axios
      .get(reqURL)
      .then(res => {
        const data = res.data.data
        const user: User = new User(data.id, data.discordID, data.discordName, data.walletAddress)
        callback(null, user)
      })
      .catch(err => {
        console.error(err)
        callback(null, undefined)
      })
  }
}
