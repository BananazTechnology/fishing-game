import { BaseCommandInteraction, Client, Interaction } from 'discord.js'
import { User } from '../classes/user'
import { Commands } from '../commandList'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction)
    }
  })
}

// eslint-disable-next-line max-len
const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName)
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  // log command to console
  console.log(`${interaction.user.username} (${interaction.user.id}) ran ${slashCommand.name}`)
  await interaction.deferReply()

  // if the user is trying to create a profile, dont try to get user
  if (interaction.commandName === 'profile') {
    slashCommand.run(client, interaction)
    return
  }

  // get user details
  User.getUserByDiscordID(interaction.user.id, async (err: Error, user: User) => {
    // if user is not found
    if (err) {
      const content = 'Fish Police question your ID. Please contact LT Wock!'

      await interaction.followUp({
        ephemeral: true,
        content
      })
    } else if (!user) {
      const content = 'Please Register for a Fishing License!'

      await interaction.followUp({
        ephemeral: true,
        content
      })
    } else {
      // user found run command
      slashCommand.run(client, interaction)
    }
  })
}
