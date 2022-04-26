import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from 'src/interfaces/subCommand'
import { Command } from '../../interfaces/command'
import { view } from './profile-view'
import { create } from './profile-create'
import { User } from '../../classes/user'
import { other } from './profile-other'
import { edit } from './profile-edit'

const subCommands: SubCommand[] = [create, view, other, edit]

export const Profile: Command = {
  name: 'profile',
  description: 'Profile Command',
  type: 'CHAT_INPUT',
  options: [create, view, other, edit],
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    console.log(`user ${interaction.user.id} ran /profile in ${interaction.channelId}`)
    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        subCommands.find((c) => c.name === option.name)?.run(client, interaction, user)
      }
    })
  }
}
