import { BaseCommandInteraction, Client, GuildMemberRoleManager, MessageEmbed } from 'discord.js'
import { Command } from '../../interfaces/command'
import { User } from '../../classes/user'

export const Help: Command = {
  name: 'help',
  description: 'displays a help menu',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction, user?: User) => {
    //console.log(interaction.member.roles);
    await interaction.deferReply({ ephemeral: true })    
    const content = `
    /fish - go fishing!
    /test - test test test`

    await interaction.followUp({
      content
    })
  }
}
