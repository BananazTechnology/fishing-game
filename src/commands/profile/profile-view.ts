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
          .setColor('#FFA500')
          .setTitle(`Fishing License: ${user.discordName} :card_index:`)

        embed.addField('Wallet Address:', `\`${user.walletAddress}\``, false)
        embed.addField('Points:', `:coin: \`${user.balance}\``, true)
        embed.addField('Equipped Rod:', `:fishing_pole_and_fish: \`${getType(inv.items.find((c) => c.id === user.activeRod))}\``, true)
        embed.addField('Equipped Bait:', `:worm: \`${getType(inv.items.find((c) => c.id === user.activeBait))}\``, true)
        embed.addField('Inventory', '\u200B', false)
        embed.setThumbnail(interaction.user.avatarURL())
        //console.log(interaction.user.avatarURL);
        inv.items.forEach(item => {
          let icon = item.object == 'rod' ? ':fishing_pole_and_fish:' : ':star:'
          icon = item.object == 'bait' ? ':worm:' : icon;
          embed.addField(`${icon} ${item.type} ${item.object} x${item.qty}`, `:arrow_up:  \`${item.catchRate * 100}%\``, true)
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
