import { BaseCommandInteraction, Client, MessageActionRow, MessageSelectMenu } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { User } from '../../classes/user'
import { Inventory } from '../../classes/inventory'

export const rod: SubCommand = {
  name: 'rod',
  description: 'Set Active Rod',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })

    if (user) {
      Inventory.getInventory(user, undefined, async (err: Error, inv: Inventory) => {
        if (err) {
          const content = 'You dropped your pocket! Talk to Wock!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }
        const select = new MessageSelectMenu()

        inv.items.forEach(item => {
          if (item.object.toUpperCase() === 'ROD') {
            select.addOptions([{
              label: `${item.type}`,
              description: `Catch Rate: ${item.catchRate}`,
              value: JSON.stringify(item)
            }])
          }
          select.setCustomId('setactive')
        })

        if (select.options.length <= 0) {
          const content = 'You have no Rods! Visit the shop!'

          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }

        const row = new MessageActionRow().addComponents(select)
        const content = 'Set your active rod:'

        await interaction.followUp({
          content,
          components: [row]
        })
      })
    } else {
      const content = 'Seems like you haven\'t signed up for fishing license yet!'

      await interaction.followUp({
        ephemeral: true,
        content
      })
    }
  }
}
