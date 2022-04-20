import { Client, MessageActionRow, MessageButton, SelectMenuInteraction } from 'discord.js'
import { Bait } from 'src/classes/bait'
import { Rod } from 'src/classes/rod'
import { Special } from 'src/classes/special'
import { Shop } from '../../classes/shop'
import { MenuSelect } from '../../interfaces/menuSelect'

export const ShopConfirm: MenuSelect = {
  name: 'shopconfirm',
  description: 'Ask Item Buy',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    await interaction.deferReply({ ephemeral: true })

    const val = +interaction.values[0]
    console.log(interaction.values[0])
    Shop.getItem(val, async (err: Error, item: Rod|Bait|Special) => {
      if (err) {
        const content = 'Shop is closed! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      const content = `Are you sure you want to buy ${item.type} ${item.object} (x${item.qty}) for ${item.cost}$?`

      const row = new MessageActionRow()
      row.addComponents(
        new MessageButton()
          .setLabel('Yes')
          .setStyle('PRIMARY')
          .setCustomId(`shopaccept:${item.id}`)
      )
      row.addComponents(
        new MessageButton()
          .setLabel('No')
          .setStyle('SECONDARY')
          .setCustomId('shopdeny')
      )

      // interaction.values.push(JSON.stringify(item))

      await interaction.followUp({
        ephemeral: true,
        content,
        components: [row]
      })
    })
  }
}
