import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, SelectMenuInteraction } from 'discord.js'
import { MenuSelects } from '../menuSelectList'
import { User } from '../classes/user'
import { Commands } from '../commandList'
import { ButtonInteractions } from '../buttonList'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction)
    } else if (interaction.isSelectMenu()) {
      await handleSelectMenu(client, interaction)
    } else if (interaction.isButton()) {
      await handleButtonClick(client, interaction)
    }
  })
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName)
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  // log command to console
  console.log(`${interaction.user.username} (${interaction.user.id}) ran ${slashCommand.name}`)

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
  const menuInteraction = MenuSelects.find((c) => c.name === interaction.customId)
  if (!menuInteraction) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  // log command to console
  console.log(`${interaction.user.username} (${interaction.user.id}) made a selection on ${interaction.customId}`)

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
      menuInteraction.run(client, interaction)
    }
  })
}

const handleButtonClick = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
  const buttonInteraction = ButtonInteractions.find((c) => c.name === interaction.customId)
  if (!buttonInteraction) {
    interaction.reply({ ephemeral: true, content: 'An error has occurred' })
    return
  }

  // log command to console
  console.log(`${interaction.user.username} (${interaction.user.id}) clicked button ${interaction.customId}`)

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
      buttonInteraction.run(client, interaction)
    }
  })
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
