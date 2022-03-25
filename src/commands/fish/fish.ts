import { BaseCommandInteraction, Client } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location as L } from '../../classes/location'

export const Fish: Command = {
  name: 'fish',
  description: 'View Location Details',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    if (user) {
      L.getLocation(async (err: Error, loc: L) => {
        if (err) {
          const content = 'EAST?! I thought you said wEAST! You\'re lost. Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        let num: number = Math.floor(Math.random() * loc.total) + 1
        let content: string = 'You Caught: '

        for (const fish of loc.fish) {
          num -= fish.quantity
          if (num <= 0) {
            content += fish.name
            break
          }
        }

        await interaction.followUp({
          content: content
        })
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
