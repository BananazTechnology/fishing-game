import { ApplicationCommandOptionData, BaseCommandInteraction, Client, MessageEmbed } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { User } from '../../classes/user'
import { Inventory } from '../../classes/inventory'
import { Bait } from 'src/classes/bait'
import { Rod } from 'src/classes/rod'

const id: ApplicationCommandOptionData = {
  name: 'id',
  description: 'Discord ID of users profile youd like to view',
  type: 'STRING',
  required: true
}

export const other: SubCommand = {
  name: 'other',
  description: 'View a users profile',
  type: 'SUB_COMMAND',
  options: [id],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply({ ephemeral: true })
    let id
    if (interaction.options.get('id')?.value === undefined) {
      id = undefined
    } else {
      id = `${interaction.options.get('id')?.value}`
    }

    User.getUserByDiscordID(id, async (err: Error, user: User) => {
      if (err) {
        const content = 'You dropped your pocket! Talk to Wock!'

        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }

      if (user) {
        User.getFishGameUser(user, async (err: Error, fishGameUser: User) => {
          if (err) {
            const content = 'You dropped your pocket! Talk to Wock!'

            await interaction.followUp({
              ephemeral: true,
              content
            })
            return
          }

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
            embed.addField('Points:', `:coin: \`${fishGameUser.balance}\``, true)
            if (inv.items) {
              embed.addField('Equipped Rod:', `:fishing_pole_and_fish: \`${getType(inv.items.find((c) => c.id === fishGameUser.activeRod))}\``, true)
            }
            if (inv.items) {
              embed.addField('Equipped Bait:', `:worm: \`${getType(inv.items.find((c) => c.id === fishGameUser.activeBait))}\``, true)
            }
            embed.setThumbnail(interaction.user.avatarURL())
            // console.log(interaction.user.avatarURL);
            if (inv.items) {
              embed.addField('Inventory', '\u200B', false)
              inv.items.forEach(item => {
                let icon = item.object === 'rod' ? ':fishing_pole_and_fish:' : ':star:'
                icon = item.object === 'bait' ? ':worm:' : icon
                embed.addField(`${icon} ${item.type} ${item.object} x${item.qty}`, `:arrow_up:  \`${item.catchRate * 100}%\``, true)
              })
            } else {
              embed.addField('Inventory Empty', 'Ya got no stuffs', false)
            }

            await interaction.followUp({
              embeds: [embed]
            })
          })
        })
      } else {
        const content = 'Seems like you haven\'t signed up for fishing license yet!'
        await interaction.followUp({
          ephemeral: true,
          content
        })
      }
    })
  }
}

function getType (item: Bait | Rod | undefined): string {
  if (item) {
    return item.type
  } else {
    return 'Empty'
  }
}
