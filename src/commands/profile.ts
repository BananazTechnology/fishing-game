import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../interfaces/command'

export const Profile: Command = {
  name: 'profile',
  description: 'Profile Command',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = 'Profile Command'

    await interaction.followUp({
      ephemeral: true,
      content
    })
  }
}
