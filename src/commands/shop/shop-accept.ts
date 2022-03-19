import { ButtonInteraction, Client } from 'discord.js'
import { Rod } from '../../classes/rod'
import { Bait } from '../../classes/bait'
import { ButtonClick } from '../../interfaces/buttonClick'
import { User } from '../../classes/user'
import { Inventory } from '../../classes/inventory'

export const ShopAccept: ButtonClick = {
  name: 'shopaccept',
  description: 'Update User Inventory',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: ButtonInteraction, user?: User) => {
    const index = interaction.customId.indexOf(':')
    const jsonObject = JSON.parse(interaction.customId.substring(index + 1))
    let item: Bait | Rod
    if (jsonObject.object === 'bait') {
      item = new Bait(jsonObject.id, jsonObject.object, jsonObject.type, jsonObject.catchRate, jsonObject.cost)
    } else {
      item = new Rod(jsonObject.id, jsonObject.object, jsonObject.type, jsonObject.catchRate, jsonObject.cost)
    }

    if (user && user.balance) {
      User.setBalance(user, user.balance - item.cost, (err: Error, rows: string) => {
        if (err) {
          const content = 'You\'re likely broke! Talk to Wock!'

          interaction.reply({
            ephemeral: true,
            content
          })
        } else {
          Inventory.updateInventory(user, item, (err: Error, inv: Inventory) => {
            if (err) {
              const content = 'Shop is out of stock! Talk to Wock!'

              interaction.reply({
                ephemeral: true,
                content
              })
            } else {
              const content = `You bought ${item.type} ${item.object} for ${item.cost}$!`

              interaction.reply({
                ephemeral: true,
                content
              })
            }
          })
        }
      })
    } else {
      const content = 'You tried to shoplift, but theres a new Sheriff in town and you dont get away with it. Talk to Wock!'

      await interaction.reply({
        ephemeral: true,
        content
      })
    }
  }
}
