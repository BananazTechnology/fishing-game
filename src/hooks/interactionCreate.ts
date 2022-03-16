import { BaseCommandInteraction, Client, Interaction, MessageActionRow, MessageButton, SelectMenuInteraction } from 'discord.js'
import { User } from '../classes/user'
import { Commands } from '../commandList'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction)
    } else if (interaction.isSelectMenu()) {
      await handleSelectMenu(client, interaction)
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
  getUser(interaction.user.id, (err: Error, user: User) => {
    // if user is not found
    if (err && err.message.includes('No User Found')) {
      const content = 'Please Register for a Fishing License!'

      interaction.followUp({
        ephemeral: true,
        content
      })
    } else if (err) {
      console.error(err.message)
      const content = 'Banana Police question your ID. Please contact LT Wock!'

      interaction.followUp({
        ephemeral: true,
        content
      })
    } else {
      slashCommand.run(client, interaction)
    }
  })
}

const handleSelectMenu = async (client: Client, interaction: SelectMenuInteraction): Promise<void> => {
  if (!interaction.customId) {
    interaction.followUp({ content: 'An error has occurred' })
  } else {
    const item = JSON.parse(interaction.values[0])
    console.log(interaction.values[0])
    const content = `Are you sure you want to buy ${item.type} ${item.object} for ${item.cost}$?`

    const row = new MessageActionRow()
    row.addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setLabel('Yes')
        .setStyle('PRIMARY')
    )
    row.addComponents(
      new MessageButton()
        .setCustomId('secondary')
        .setLabel('No')
        .setStyle('SECONDARY')
    )
    await interaction.reply({
      ephemeral: true,
      content,
      components: [row]
    })
  }
}

const createFishGameUser = (user: User, callback: Function) => {
  User.createFishGameUser(user, (err: Error, newFGUser: User) => {
    callback(err, newFGUser)
  })
}

const getFishGameUser = (user: User, callback: Function) => {
  User.getFishGameUser(user, (err: Error, fgUser: User) => {
    if (err && err.message.includes('No user found')) {
      createFishGameUser(user, (err: Error, newFGUser: User) => {
        callback(err, newFGUser)
      })
    } else {
      callback(err, fgUser)
    }
  })
}

const getUser = (id: string, callback: Function) => {
  User.getUserByDiscordID(id, (err: Error, user: User) => {
    if (err) {
      callback(err, user)
    } else {
      getFishGameUser(user, (err: Error, newFGUser: User) => {
        callback(err, newFGUser)
      })
    }
  })
}
