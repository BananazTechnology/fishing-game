import { BaseCommandInteraction, Client, DiscordAPIError, MessageAttachment, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location as L, Location } from '../../classes/location'
import { Log } from '../../classes/log'

export const Fish: Command = {
  name: 'fish',
  description: 'Try to catch a fish',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply()

    if (user) {
      L.getLocation(interaction.channelId, async (err: Error, loc: L) => {
        if (err) {
          const content = 'Yo man, somtin sketchy about this joint. Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        User.getCatchRate(user, async (err: Error, rate: number) => {
          let attachment = new MessageAttachment('../../../Assets/Handheld_Lantern_NH_Inv_Icon.png', 'fish.png');
          if (err) {
            const content = 'YOUR LINE IS TANGLED! Talk to Wock!'

            await interaction.followUp({
              ephemeral: true,
              content
            })
            return
          }

          const embed = new MessageEmbed()
            .setColor('#0099ff')
          let num: number = Math.floor(Math.random() * loc.total) + 1
          let content: string = `${interaction.user} Caught: `
          num = ((rate * num) + num)

          for (const fish of loc.fish) {
            num -= fish.quantity
            if (num <= 0 || fish === loc.fish[loc.fish.length - 1]) {   
              content += fish.name
              embed.setTitle(`${fish.name} - ${fish.rarity}`)
              embed.addField(`${fish.description}`, `You earned: $${fish.points}`, false)
              console.log(JSON.stringify(fish))
              if(fish.image) {
                console.log(`Image: ${fish.image}`)
                embed.setImage(fish.image)
              } else {
              }
              embed.addField('Total cash in ya pocket', `$${user.balance ? (user.balance + fish.points) : 'error?'}`, false)


              if (user.balance) {
                User.setBalance(user, user.balance + fish.points, () => {})
              }

              Location.fishCaught(fish, loc, () => {})
              Log.newLog(user, fish, loc, () => {})

              break
            }
          }

          await interaction.followUp({
            content: content,
            embeds: [embed]
          })
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
