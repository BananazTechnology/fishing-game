import { Client } from 'discord.js'
import * as dotenv from 'dotenv'
import interactionCreate from './hooks/interactionCreate'
import ready from './hooks/ready'

dotenv.config()
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: []
})

ready(client)
interactionCreate(client)

client.login(token)
