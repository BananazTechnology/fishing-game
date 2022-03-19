import { Client, MessageActionRow, MessageButton, SelectMenuInteraction } from 'discord.js'
import { MenuSelect } from '../../interfaces/menuSelect'

export const ShopConfirm: MenuSelect = {
  name: 'shopconfirm',
  description: 'Ask Item Buy',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    // await interaction.deferReply({ ephemeral: true })

    const item = JSON.parse(interaction.values[0])
    console.log(interaction.values[0])
    const content = `Are you sure you want to buy ${item.type} ${item.object} for ${item.cost}$?`

    const row = new MessageActionRow()
    row.addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setLabel('Yes')
        .setStyle('PRIMARY')
        .setCustomId('shopaccept')
    )
    row.addComponents(
      new MessageButton()
        .setCustomId('secondary')
        .setLabel('No')
        .setStyle('SECONDARY')
        .setCustomId('shopdeny')
    )

    // interaction.values.push(JSON.stringify(item))

    await interaction.reply({
      ephemeral: true,
      content,
      components: [row]
    })
  }
}
