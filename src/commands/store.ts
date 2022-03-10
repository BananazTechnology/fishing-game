import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../interfaces/command'

export const Store: Command = {
  name: 'store',
  description: 'Store Command',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = 'Store Command'

    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
