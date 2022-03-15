import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../../interfaces/command'

export const Fish: Command = {
  name: 'fish',
  description: 'Fish Command',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = 'Fish Command'

    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
