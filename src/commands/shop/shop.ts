import { BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Command } from '../../interfaces/command'
import { view } from './shop-view'
import { addRod } from './shop-addrod'
import { addBait } from './shop-addbait'

const subCommands: SubCommand[] = [view, addRod, addBait]

export const Shop: Command = {
  name: 'shop',
  description: 'shop Command',
  type: 'CHAT_INPUT',
  options: [view],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    console.log(`user ${interaction.user.id} ran /shop in ${interaction.channelId}`)

    interaction.options.data.forEach(option => {
      if (option.type === 'SUB_COMMAND') {
        subCommands.find((c) => c.name === option.name)?.run(client, interaction)
      }
    })
  }
}
