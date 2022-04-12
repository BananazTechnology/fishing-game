import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location as L, Location } from '../../classes/location'
import { Log } from '../../classes/log'
import { Bait } from '../../classes/bait'

export const Fish: Command = {
  name: 'fish',
  description: 'Try to catch a fish',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply()

    if (user) {
      let fishCooldown = 0 // in seconds
      fishCooldown = fishCooldown * 1000 // convert to ms
      if (!user.lastFish || (Number(user.lastFish) + fishCooldown) < Number(Date.now())) {
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
                if (fish.image) {
                  embed.setThumbnail(fish.image)
                }
                embed.addField(`You caught a ${fish.name}!`, `${fish.description}`)
                embed.addFields(
                  { name: 'Rarity', value: `${fish.rarity}`, inline: true },
                  { name: 'Earned $', value: `${fish.points}`, inline: true },
                  { name: 'Total $', value: `${user.balance ? user.balance + fish.points : 0}`, inline: true }
                )

                if (user.balance) {
                  User.setBalance(user, user.balance + fish.points, () => {})
                }
                User.setLastFish(user, Date.now(), () => {})

                Location.fishCaught(fish, loc, () => {})
                Log.newLog(user, fish, loc, () => {})
                Bait.useBait(user, () => {})

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
        // const content = `You can run this command again in ${Math.abs(Number(Date.now() - (Number(user.lastFish) + fishCooldown)))/ 1000} seconds`
        const content = `You can run this command again in <t:${Math.floor((Number(user.lastFish) / 1000) + (fishCooldown / 1000))}:R>`
        await interaction.followUp({
          content
        })
      }
    } else {
      const content = 'Seems like you haven\'t signed up for fishing license yet!'
      await interaction.followUp({
        content
      })
    }
  }
}
