import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { User } from '../../classes/user'

export const view: SubCommand = {
  name: 'view',
  description: 'View your profile',
  type: 'SUB_COMMAND',
  options: [],
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    if (user) {
      const content =
      `Discord Id: ${user.discordID}\nDiscord Name: ${user.discordName}\nWallet: ${user.walletAddress}
      FG Balance: ${user.balance}
      FG Active Rod: ${user.activeRod}
      FG Active Bait: ${user.activeBait}`

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
  }
}
