import { BaseCommandInteraction, Client, MessageEmbed, MessageOptions, MessagePayload, TextChannel, Util } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Location as L, Location } from '../../classes/location'
import { Log } from '../../classes/log'
import { Bait } from '../../classes/bait'
import { Inventory } from '../../classes/inventory'
import { Special } from '../../classes/special'

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

          if (!await canFish(user, loc)) {
            const content = 'You dont have the right gear for this location!'

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
            let num: number = Math.floor(Math.random() * loc.total) + 1
            let content: string = `${interaction.user}`
            num = ((rate * num) + num)

            for (const fish of loc.fish) {
              // start color shit
              let icon = ':white_circle: '
              switch (fish.rarity) {
                case 'Trash': {
                  embed.setColor('#969696')
                  icon = ':white_circle: '
                  break
                }
                case 'Common': {
                  embed.setColor('#09c13f')
                  icon = ':green_circle: '
                  break
                }
                case 'Rare': {
                  embed.setColor('#12acff')
                  icon = ':blue_circle: '
                  break
                }
                case 'Epic': {
                  embed.setColor('#b837ff')
                  icon = ':purple_circle: '
                  break
                }
                case 'Legendary': {
                  embed.setColor('#ff912f')
                  icon = ':orange_circle: '
                  break
                }
                case 'Mythical': {
                  embed.setColor('#ff3d3d')
                  icon = ':red_circle: '
                  break
                }
                default: {
                  break
                }
              }

              // end color shit
              num -= fish.quantity
              if (num <= 0 || fish === loc.fish[loc.fish.length - 1]) {
                //content += fish.name
                if (fish.image) {
                  embed.setThumbnail(fish.image)
                }
                embed.setTitle(`You caught a ${fish.name}!`)
                embed.setDescription(`${fish.description}`)
                embed.addFields(
                  { name: 'Rarity:', value: `${icon} ${fish.rarity}`, inline: true },
                  { name: 'Points:', value: `:coin: \`${fish.points}\``, inline: true }//,
                  // { name: 'Total $', value: `${user.balance ? user.balance + fish.points : 0}`, inline: true }
                )

                if (user.balance) {
                  User.setBalance(user, user.balance + fish.points, () => {})
                }
                User.setLastFish(user, Date.now(), () => {})

                Location.fishCaught(fish, loc, () => {})
                Log.newLog(user, fish, loc, () => {})
                Bait.useBait(user, () => {})

                if (fish.id === 115) {
                  Inventory.updateInventory(user, new Special(18, '', '', 0, 0, 1), () => {})
                }
                let specialFishIds = [113];
                if(specialFishIds.includes(fish.id) || Number(fish.points) >= 20){
                  sendToOne(client, '967450474318024744', `${user.discordName} caught a ${fish.name}. Here's their wallet: ${user.walletAddress}`)
                }

                break
              }
            }

            await interaction.followUp({
              ephemeral: false,
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

function canFish (user: User, location: Location): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (location.requirement) {
      Inventory.getInventory(user, location.requirement, (err: Error, inv: Inventory) => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    } else {
      resolve(true)
    }
  })
}

async function sendToOne (client: Client, id: string, msg: string | MessagePayload | MessageOptions) {

  if (!id) return
  const channel = await client.channels.fetch(id)
  // Using a type guard to narrow down the correct type
  if (!((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(channel)) return
  channel.send(msg)
}
