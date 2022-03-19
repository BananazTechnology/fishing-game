import { ButtonInteraction, Client } from 'discord.js'
import { ButtonClick } from 'src/interfaces/buttonClick'

export const ShopDeny: ButtonClick = {
  name: 'shopdeny',
  description: 'User denied to buy',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: ButtonInteraction) => {
    const content = 'Nothing was bought!'

    await interaction.reply({
      ephemeral: true,
      content
    })
  }
}
