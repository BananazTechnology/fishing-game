import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Tournament } from '../../classes/tournament'
import { Log } from '../../classes/log'

export const Leaderboard: Command = {
  name: 'tleaderboard',
  description: 'Show Tournament Leaderboard',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    Tournament.getLatest(async (err: Error, result: Tournament) => {
      if (err) {
        const content = 'No Tournament found! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      Tournament.getLeaderboard(result, async (err: Error, result: Log[]) => {
        if (err) {
          const content = 'Leaderboard Issue! Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        const embed = new MessageEmbed().setColor('#0099ff')
        embed.setTitle('Leaderboard')
        let count = 1

        result.forEach(log => {
          if (log.user) {
            embed.addField(`${count} - ${log.user.discordName}`, `Count: ${log.count}`, true)
            count++
          }
        })

        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        })
      })
    })
  }
}
