import { ApplicationCommandOptionData, BaseCommandInteraction, Client } from 'discord.js'
import { SubCommand } from '../../interfaces/subCommand'
import { Shop as Store } from '../../classes/shop'
import { Rod } from '../../classes/rod'
import { Util } from '../../util'


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


export const addRod: SubCommand = {
    name: 'addrod',
    description: 'Add a new rod to the shop!',
    type: 'SUB_COMMAND',
    options: [type, catchRate, cost],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
      console.log('Adding Rod to Database')
  
      const name = Util.getOptionString(interaction, 'name')
      const catchRate = Util.getOptionNumber(interaction, 'catchrate')
      const cost = Util.getOptionNumber(interaction, 'cost')
  
      if (!name || !catchRate || !cost) {
        const content = 'Shop rejected your Rod! Add missing options! Talk to Wock!'
  
        await interaction.followUp({
          ephemeral: true,
          content
        })
        return
      }
  
      Rod.createRod(name, catchRate, cost, async (err: Error, shop: Store) => {
        if (err) {
          const content = 'Shop rejected your Rod! Talk to Wock!'
  
          await interaction.followUp({
            ephemeral: true,
            content
          })
          return
        }
        const content = 'Rod Created'
  
        await interaction.followUp({
          ephemeral: true,
          content
        })
      })
    }
  }