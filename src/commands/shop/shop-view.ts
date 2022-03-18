import { BaseCommandInteraction, Client, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'

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
        .setAuthor({ name: 'Fisherman Dave\'s Market', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      const select = new MessageSelectMenu()

      shop.items.forEach(item => {
        console.log(JSON.stringify(item))
        embed.addField(`Item Type: ${item.type} ${item.object}`, `Boost: ${item.catchRate}\t | \t ${item.cost}$`, false)
        select.addOptions([{
          label: `Item Type: ${item.type}`,
          description: `${item.cost}$`,
          value: JSON.stringify(item)
        }])
        select.setCustomId('shopconfirm')
      })

      const row = new MessageActionRow().addComponents(select)

      await interaction.followUp({
        embeds: [embed],
        components: [row]
      })
    })
  }
}
