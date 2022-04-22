import { BaseCommandInteraction, Client, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'
import { Util } from '../../util'
import { User } from '../../classes/user'

export const view: SubCommand = {
  name: 'view',
  description: 'View the Shop',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })
    console.log('Getting Shop from Database')
    Store.getShop(user, async (err: Error, shop: Store) => {
      if (err) {
        const content = 'Shop is closed! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      const embed = new MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Fishing Shop :flags:')
      const select = new MessageSelectMenu()

      let embedArray: MessageEmbed[] = [embed]
      shop.items.forEach(item => {
        let icon = item.object === 'rod' ? ':fishing_pole_and_fish: ' : ':star: '
        icon = item.object === 'bait' ? ':worm: ' : icon
        embedArray = Util.multiEmbedBuilder(embedArray, item.qty > 1 ? `${icon} **${item.type} ${item.object} (x${item.qty})**` : `:fishing_pole_and_fish: **${item.type} ${item.object}**`, `:coin: \`${item.cost}\`-:arrow_up: \`${item.catchRate * 100}%\``, true)
        // embedArray, 'Item', `${item.object}`, 'Type', `${item.type} (x${item.qty})`, 'Boost', `${item.catchRate}`, 'Cost', `${item.cost}`, true)
        select.addOptions([{
          label: `${item.type} ${item.object} (x${item.qty})`,
          description: `${item.cost} Points`,
          value: `${item.id}`
        }])
        select.setCustomId('shopconfirm')
      })
      // console.log(JSON.stringify(item))
      //   embed.addFields(
      //     {name: 'Item', value: `${item.object}`, inline: true},
      //     {name: 'Type', value: `${item.type}`, inline: true},
      //     {name: 'Boost', value: `${item.catchRate}`, inline: true},
      //     {name: 'Cost', value: `${item.cost}`, inline: true},
      //   )
      //   //embed.addField(`Item Type: ${item.type} ${item.object}`, `Boost: ${item.catchRate}\t | \t ${item.cost}$`, false)

      const row = new MessageActionRow().addComponents(select)

      await interaction.followUp({
        embeds: embedArray,
        components: [row]
      })
    })
  }
}
