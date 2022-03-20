import { Client, SelectMenuInteraction } from 'discord.js'
import { User } from '../../classes/user'
import { MenuSelect } from '../../interfaces/menuSelect'

export const SetActive: MenuSelect = {
  name: 'setactive',
  description: 'Set Active Item',
  type: 'SUB_COMMAND',
  run: async (client: Client, interaction: SelectMenuInteraction, user?: User) => {
    await interaction.deferReply({ ephemeral: true })
    const item = JSON.parse(interaction.values[0])

    if (user) {
      User.setActiveItem(user, item, (err: Error, upd: any) => {
        if (err) {
          const content = 'Thats not yours! Don\'t touch it! Wait, no, maybe its us, talk to Wock!'

          interaction.followUp({
            ephemeral: true,
            content
          })
        } else {
          const content = `Active ${item.object} set to ${item.type}!`

          interaction.followUp({
            ephemeral: true,
            content
          })
        }
      })
    } else {
      const content = 'Look what you did now! You broke it! *Sigh* Talk to Wock ...'

      await interaction.followUp({
        ephemeral: true,
        content
      })
    }
  }
}
