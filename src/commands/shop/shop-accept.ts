import { ButtonInteraction, Client } from 'discord.js'
import { Rod } from '../../classes/rod'
import { Bait } from '../../classes/bait'
import { ButtonClick } from '../../interfaces/buttonClick'
import { User } from '../../classes/user'
import { Inventory } from '../../classes/inventory'
import { Special } from '../../classes/special'
import { Shop } from '../../classes/shop'

export const ShopAccept: ButtonClick = {
  name: 'shopaccept',
  description: 'Update User Inventory',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: ButtonInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    const index = interaction.customId.indexOf(':')
    const val = +interaction.customId.substring(index + 1)

    Shop.getItem(val, async (err: Error, item: Rod|Bait|Special) => {
      if (err) {
        const content = 'Shop is closed! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      if (user && user.balance > -1) {
        User.setBalance(user, user.balance - item.cost, (err: Error, rows: string) => {
          if (err) {
            const content = 'You\'re likely broke! Talk to Wock!'

            interaction.followUp({
              ephemeral: true,
              content
            })
          } else {
            Inventory.updateInventory(user, item, (err: Error, inv: Inventory) => {
              if (err) {
                const content = 'Shop is out of stock! Talk to Wock!'

                interaction.followUp({
                  ephemeral: true,
                  content
                })
              } else {
                const content = `You bought ${item.type} ${item.object} for ${item.cost}$!`

                interaction.followUp({
                  ephemeral: true,
                  content
                })
              }
            })
          }
        })
      } else {
        const content = 'You tried to shoplift, but theres a new Sheriff in town and you dont get away with it. Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
      }
    })
  }
}
