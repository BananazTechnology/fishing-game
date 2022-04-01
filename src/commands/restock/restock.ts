import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location } from '../../classes/location'

export const Restock: Command = {
  name: 'restock',
  description: 'Restocks all locations',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply()

    if (user) {
      Location.restockLocations(async (err: Error, result: string) => {
        if (err) {
          const content = 'Dem Fish Stock Gettin Lower. Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('RESTOCK')
        embed.addField('\u200B', '\u200B', false)
        embed.addField('All Locations Restocked', result, false)

        await interaction.followUp({
          embeds: [embed]
        })
      })
    } else {
      const content = 'Seems like you haven\'t signed up for fishing license yet!'
      await interaction.followUp({
        content
      })
    }
  }
}
