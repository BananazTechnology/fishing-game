import { BaseCommandInteraction, Client, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'
import { Util } from '../../util'

export const view: SubCommand = {
  name: 'view',
  description: 'View the Shop',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    console.log('Getting Shop from Database')
    Store.getShop(async (err: Error, shop: Store) => {
      if (err) {
        const content = 'Shop is closed! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Fisherman Dave\'s Market')
      const select = new MessageSelectMenu()

      let embedArray: MessageEmbed[] = [embed]
      shop.items.forEach(item => {
        embedArray = Util.fourElementMultiEmbedBuilder(embedArray, 'Item', `${item.object}`, 'Type', `${item.type} (x${item.qty})`, 'Boost', `${item.catchRate}`, 'Cost', `${item.cost}`, true)
        select.addOptions([{
          label: `${item.type} ${item.object} (x${item.qty})`,
          description: `${item.cost}$`,
          value: JSON.stringify(item)
        }])
        select.setCustomId('shopconfirm')
      })
        //console.log(JSON.stringify(item))
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
