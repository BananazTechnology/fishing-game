import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { Command } from '../../interfaces/command'
import { bait } from './set-bait'
import { rod } from './set-rod'
import { User } from '../../classes/user'

const subCommands: SubCommand[] = [rod, bait]

export const Set: Command = {
  name: 'set',
  description: 'Set active items',
  type: 'CHAT_INPUT',
  options: [rod, bait],
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        subCommands.find((c) => c.name === option.name)?.run(client, interaction, user)
      }
    })
  }
}
