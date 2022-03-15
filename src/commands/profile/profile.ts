import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import axios from 'axios'
import { view } from './profile-view'
import { create} from './profile-create'

const subCommands: SubCommand[] = [create, view]

export const Profile: Command = {
  name: 'profile',
  description: 'Profile Command',
  type: 'CHAT_INPUT',
  options: [create, view],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        subCommands.find((c) => c.name === option.name)?.run(client, interaction)
      }
    })
  }
}
