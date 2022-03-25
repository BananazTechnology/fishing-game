import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location as L } from '../../classes/location'
import { Fish } from 'src/classes/fish'

export const Location: Command = {
  name: 'location',
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

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Location: ${loc.name}`)
        embed.addField('\u200B', '\u200B', false)
        embed.addField('Fish', '\u200B', false)
        loc.fish.forEach((fish: Fish) => {
          embed.addField(`${fish.name.toLocaleUpperCase()}`, `Stock: ${fish.quantity}`, true)
        })

        await interaction.followUp({
          embeds: [embed]
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
