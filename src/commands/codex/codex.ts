import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Log } from '../../classes/log'

export const Codex: Command = {
  name: 'codex',
  description: 'Fish Catch Count',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    if (user) {
      Log.getUserCodex(user, async (err: Error, log: Log[]) => {
        if (err) {
          const content = 'Yo man, somtin sketchy about this joint. Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        const embed = new MessageEmbed()
          .setColor('#0099ff')

        let content: string = ''
        const trophy = 
        for (const record of log) {
          content += `${record.count}: \t ${record.fish}\n`
        }

        embed.setTitle('User Codex')
        embed.setDescription(content)

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
