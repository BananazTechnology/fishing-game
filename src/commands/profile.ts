import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { Command } from '../interfaces/command'

const create: SubCommand = {
  name: 'create',
  description: 'Create a new profile',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = 'Profile Create'

    await interaction.followUp({
      ephemeral: true,
      content
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
