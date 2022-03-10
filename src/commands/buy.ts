import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../interfaces/command'

export const Buy: Command = {
  name: 'buy',
  description: 'Buy Command',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = 'Buy Command'

    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
