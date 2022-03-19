import { ButtonInteraction, Client } from 'discord.js'
import { ButtonClick } from 'src/interfaces/buttonClick'

export const ShopAccept: ButtonClick = {
  name: 'shopaccept',
  description: 'Update User Inventory',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: ButtonInteraction) => {
    const content = 'You Bought an item!'

    await interaction.reply({
      ephemeral: true,
      content
    })
  }
}
