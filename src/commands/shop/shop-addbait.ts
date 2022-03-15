import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'
import { Util } from '../../util'
import { Bait } from '../../classes/bait'


const type: ApplicationCommandOptionData = {
    name: 'name',
    description: 'Name of Object',
    type: 'STRING',
    required: true
}
  
const catchRate: ApplicationCommandOptionData = {
    name: 'catchrate',
    description: 'Catch Rate of Object',
    type: 'NUMBER',
    required: true
}
  
const cost: ApplicationCommandOptionData = {
    name: 'cost',
    description: 'Cost of Object',
    type: 'INTEGER',
    required: true
}

export const addBait: SubCommand = {
    name: 'addbait',
    description: 'Add a new bait to the shop!',
    type: 'SUB_COMMAND',
    options: [type, catchRate, cost],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
      console.log('Adding Bait to Database')
  
      const name = Util.getOptionString(interaction, 'name')
      const catchRate = Util.getOptionNumber(interaction, 'catchrate')
      const cost = Util.getOptionNumber(interaction, 'cost')
  
      if (!name || !catchRate || !cost) {
        const content = 'Shop rejected your Bait! Add missing options! Talk to Wock!'
  
        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }
  
      Bait.createBait(name, catchRate, cost, async (err: Error, shop: Store) => {
        if (err) {
          const content = 'Shop rejected your Bait! Talk to Wock!'
  
          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }
        const content = 'Bait Created'
  
        await interaction.followUp({
          ephemeral: true,
          content
        })
      })
    }
  }