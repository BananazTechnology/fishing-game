import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const port = process.env.DB_PORT ? +process.env.DB_PORT : undefined

// eslint-disable-next-line no-unused-vars
export class KeyDB {
  static getConnection (): mysql.Connection|undefined {
    console.debug('Attempting DB Connection')
    try {
      const conn = mysql.createConnection({
        host: process.env.DB_HOST,
        port: port,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME
      })

      conn.on('error', function (err: any) {
        console.log(err)
      })

      return conn
    } catch {
      console.error('Error Code: UA-SRDADB1')
    }
  }
}
