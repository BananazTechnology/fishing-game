import { BaseCommandInteraction, Client, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'

export const view: SubCommand = {
    name: 'view',
    description: 'View the Shop',
    type: 'SUB_COMMAND',
    run: async (client: Client, interaction: BaseCommandInteraction) => {
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
        .setAuthor({ name: `Fisherman Dave's Market`, iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })


        shop.items.forEach(item => {
          embed.addField(`Item Type: ${item.type} ${item.object}`, `Boost: ${item.catchRate}\t | \t ${item.cost}$`, false)
        })
        
        await interaction.followUp({
          ephemeral: true,
          embeds: [embed]
        })
      })
    }
}