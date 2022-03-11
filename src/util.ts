import { BaseCommandInteraction } from 'discord.js'

export class Util {
  static checkString (str: string|undefined): string {
    if (str === 'null' || str === 'undefined') {
      str = 'null'
    } else if (str) {
      str = `'${str}'`
    } else {
      str = 'null'
    }

    return str
  }

  static getOptionString (interaction: BaseCommandInteraction, option:string) {
    if (interaction.options.get(option)?.value === undefined) {
      return undefined
    } else {
      return `${interaction.options.get(option)?.value}`
    }
  }

  static getOptionNumber (interaction: BaseCommandInteraction, option:string) {
    if (interaction.options.get(option)?.value === undefined) {
      return undefined
    } else {
      return +`${interaction.options.get(option)?.value}`
    }
  }
}
