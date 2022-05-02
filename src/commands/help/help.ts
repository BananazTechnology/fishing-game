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
    let content = `---------------------------------\n`
    Commands.forEach(command => {
      let adminOnly = false;
      if(command.name == 'restock' || command.name == 'tournament' || command.name == 'location'){
        adminOnly = true;
      }
      content += `\`\`/${command.name}\`\` - ${command.description} ${adminOnly ? `(Admin Only)` : ``}\n\n`
      
    })

    await interaction.followUp({
      content
    })
  }
}
