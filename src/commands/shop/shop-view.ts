import { BaseCommandInteraction, Client } from 'discord.js'
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
  
        let content = ''
  
        shop.items.forEach(item => {
          content += `${item.object}\t${item.type}\t${item.catchRate}\t${item.cost}\n`
        })
  
        await interaction.followUp({
          ephemeral: true,
          content
        })
      })
    }
}