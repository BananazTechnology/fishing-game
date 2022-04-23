import { BaseCommandInteraction, Client, GuildMemberRoleManager, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'
import { Commands } from '../../commandList'

export const Help: Command = {
  name: 'help',
  description: 'displays a help menu',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    //console.log(interaction.member.roles);
    await interaction.deferReply({ ephemeral: true })    
    let content = ''
    Commands.forEach(command => {
      content += `/${command.name} - ${command.description}\n`
    })

    await interaction.followUp({
      content
    })
  }
}
