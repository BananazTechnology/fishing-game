import { ApplicationCommandOptionData, BaseCommandInteraction, Client, MessageEmbed, MessageOptions, MessagePayload, TextChannel } from 'discord.js'
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
              const embed = new MessageEmbed().setColor('#ff6290')
              //embed.setTitle(`Tournament - ${fish.name} - ${len} hours`)
              embed.setTitle(`:trophy: Fishing Tournament Started!`)
              embed.setDescription(`Catch the most of the tournament fish to win! The tournament spans across all fishing channels. The duration of the tournament and the target fish can be seen below!`)
              //embed.addField(`Tournament Type: ${fish.name}`,`End Time: <t:${Math.floor(Date.now() / 1000) + (len * 60 * 60) }:R>`, false)
              embed.addField(`:fishing_pole_and_fish: Tournament Fish:`, `${fish.name}`, true)
              embed.addField(`:alarm_clock: End Time:`, `<t:${Math.floor(Date.now() / 1000) + (len * 60 * 60) }:R>`, true)
              if (fish.image && embed) {
                embed.setThumbnail(fish.image)
              }

              sendToAll(client, result, { embeds: [embed] })

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

async function sendToAll (client: Client, list: Location[], msg: string | MessagePayload | MessageOptions) {
  list.forEach(async location => {
    // Get the log channel
    const channel = await client.channels.fetch(location.channelID)

    if (!channel) return

    // Using a type guard to narrow down the correct type
    if (!((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(channel)) return

    channel.send(msg)
  })
}
