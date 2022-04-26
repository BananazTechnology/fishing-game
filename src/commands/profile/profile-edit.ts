import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { User } from '../../classes/user'

const wallet: ApplicationCommandOptionData = {
  name: 'wallet',
  description: 'ETH Wallet Address',
  type: 'STRING',
  required: true
}

export const edit: SubCommand = {
  name: 'edit',
  description: 'Edit your profile',
  type: 'SUB_COMMAND',
  options: [wallet],
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })
    let wallet
    if (interaction.options.get('wallet')?.value === undefined) {
      wallet = undefined
    } else {
      wallet = `${interaction.options.get('wallet')?.value}`
    }

    User.editUser(user.id, interaction.user.id, interaction.user.username, wallet, (err: Error, result: any) => {
      if (err) {
        const content = 'Permit Registry closed! Talk to Papa Wock!'

        interaction.followUp({
          ephemeral: true,
          content
        })
      } else {
        const content = 'User Updated'

        interaction.followUp({
          ephemeral: true,
          content
        })
      }
    })
  }
}
