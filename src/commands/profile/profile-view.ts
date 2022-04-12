import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { Inventory } from '../../classes/inventory'
import { SubCommand } from '../../interfaces/subCommand'
import { User } from '../../classes/user'
import { Bait } from 'src/classes/bait'
import { Rod } from 'src/classes/rod'

export const view: SubCommand = {
  name: 'view',
  description: 'View your profile',
  type: 'SUB_COMMAND',
  options: [],
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

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Profile: ${user.discordName}`)

        embed.addField('Wallet Address:', `${user.walletAddress}`, false)
        embed.addField('Game Balance:', `$${user.balance}`, false)
        embed.addField('Active Rod:', `${getType(inv.items.find((c) => c.id === user.activeRod))}`, true)
        embed.addField('Active Bait:', `${getType(inv.items.find((c) => c.id === user.activeBait))}`, true)
        embed.addField('\u200B', '\u200B', false)
        embed.addField('Inventory', '\u200B', false)
        inv.items.forEach(item => {
          embed.addField(`${item.type.toLocaleUpperCase()} ${item.object.toLocaleUpperCase()} x${item.qty}`, `Catch Rate: ${item.catchRate}`, true)
        })

        await interaction.followUp({
          embeds: [embed]
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

function getType (item: Bait | Rod | undefined): string {
  if (item) {
    return item.type
  } else {
    return 'Empty'
  }
}
