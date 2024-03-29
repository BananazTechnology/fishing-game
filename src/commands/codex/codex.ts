import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Log } from '../../classes/log'
import { Util } from '../../util'

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
          .setTitle('Fishing Codex :blue_book:')
          .setColor('#0000FF')
          .setDescription(`Welcome to the Fishing Compendium. Here you'll see how many of each fish you've caught`)
          .setColor('#0099ff')
          //.addField('- - - - - - - - - - - - - - - - - - - - - - - - - - - Codex - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', '\u200B', false)

        //const trophy = 
        let embedArray: MessageEmbed[] = [embed]
        let specialItems = ['Stick', 'Waterfall Crystal'];
        for (const record of log) {
          if(!specialItems.includes(record.fish.toString())){
            embedArray = Util.multiEmbedBuilder(embedArray, `**${record.fish}**`, `:hook: \`${record.count}\``, true)
          }
        }

        await interaction.followUp({
          embeds: embedArray
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
