import { ApplicationCommandOptionData, BaseCommandInteraction, Client, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Tournament as T } from '../../classes/tournament'
import { Fish } from '../../classes/fish'
import { Location } from '../../classes/location'

const fish: ApplicationCommandOptionData = {
  name: 'fish',
  description: 'Fish Name',
  type: 'STRING',
  required: true
}

const length: ApplicationCommandOptionData = {
  name: 'length',
  description: 'Length in HOURS',
  type: 'NUMBER',
  required: true
}

export const Tournament: Command = {
  name: 'tournament',
  description: 'Start a new tournament',
  type: 'CHAT_INPUT',
  options: [fish, length],
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    let fish: string|undefined, len: number
    if (interaction.options.get('fish')?.value === undefined) {
      fish = undefined
    } else {
      fish = `${interaction.options.get('fish')?.value}`
    }

    if (interaction.options.get('length')?.value === undefined) {
      len = 24
    } else {
      len = +`${interaction.options.get('length')?.value}`
    }

    Fish.getByName(fish, async (err: Error, fish: Fish) => {
      if (err) {
        const content = 'No Fish found! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      const start: Date = new Date()
      const end: Date = new Date(new Date().setTime(start.getTime() + (len * 60 * 60 * 1000)))

      T.newTournament(start, end, new Fish(fish.id, '', '', '', 0, 0, ''), async (err: Error, tournament: any) => {
        if (err) {
          const content = 'No Tournament Created! Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
        } else {
          Location.getAllLocations(async (err: Error, result: Location[]) => {
            if (err) {
              const content = 'Tournament Created!'

              await interaction.followUp({
                ephemeral: true,
                content
              })
            } else {
              const embed = new MessageEmbed().setColor('#0099ff')
              embed.setTitle(`Tournament - ${fish.name} - ${len} hours`)
              if (fish.image) {
                embed.setImage(fish.image)
              }

              result.forEach(async location => {
                // Get the log channel
                const logChannel = await client.channels.fetch(location.channelID)

                if (!logChannel) return

                // Using a type guard to narrow down the correct type
                if (!((logChannel): logChannel is TextChannel => logChannel.type === 'GUILD_TEXT')(logChannel)) return

                logChannel.send({ embeds: [embed] })
              })

              await interaction.followUp({
                ephemeral: true,
                content: 'Tournament Created!'
              })
            }
          })
        }
      })
    })
  }
}
