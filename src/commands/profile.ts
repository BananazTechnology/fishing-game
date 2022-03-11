import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { Command } from '../interfaces/command'
import { User } from '../classes/user'
import axios from 'axios'

const wallet: ApplicationCommandOptionData = {
  name: 'wallet',
  description: 'ETH Wallet Address',
  type: 'STRING',
  required: true
}

const create: SubCommand = {
  name: 'create',
  description: 'Create a new profile',
  type: 'SUB_COMMAND',
  options: [wallet],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    let wallet
    if (interaction.options.get('wallet')?.value === undefined) {
      wallet = undefined
    } else {
      wallet = `${interaction.options.get('wallet')?.value}`
    }

    User.createUser(interaction.user.id, interaction.user.username, wallet, async (err: Error, result: any) => {
      if (err && axios.isAxiosError(err) && err.response && err.response.data.message.includes('Duplicate entry')) {
        const content = 'You already have a permit! You\'re good to go!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      } else if (err) {
        const content = 'Permit Registry closed! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      } else {
        const content = 'User Created'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      }
    })
  }
}

const subCommands: SubCommand[] = [create]

export const Profile: Command = {
  name: 'profile',
  description: 'Profile Command',
  type: 'CHAT_INPUT',
  options: [create],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        subCommands.find((c) => c.name === option.name)?.run(client, interaction)
      }
    })
  }
}
