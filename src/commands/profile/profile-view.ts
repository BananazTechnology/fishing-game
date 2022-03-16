import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { User } from '../../classes/user'
import axios from 'axios'

export const view: SubCommand = {
  name: 'view',
  description: 'View your profile',
  type: 'SUB_COMMAND',
  options: [],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    User.getUserByDiscordID(interaction.user.id, async (err: Error, result: any) => {
      if (err && axios.isAxiosError(err) && err.response && err.response.data.message.includes('Cannot send an empty message')) {
        const content = 'Seems like you haven\'t signed up for a fishing license yet!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      } else if (err) {
        const content = 'Error'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      } else if (result) {
        const content =
          `Discord Id: ${result.discordID}\nDiscord Name: ${result.discordName}\nWallet: ${result.walletAddress}`

        await interaction.followUp({
          ephemeral: true,
          content
        })
      } else {
        const content = 'Seems like you haven\'t signed up for fishing license yet!'
        await interaction.followUp({
          ephemeral: true,
          content
        })
      }
    })
  }
}
