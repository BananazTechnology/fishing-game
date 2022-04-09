import { BaseCommandInteraction, MessageEmbed } from 'discord.js'

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

  static multiEmbedBuilder (embedArray: MessageEmbed[], name: string, value: string, inline: boolean|undefined): MessageEmbed[] {
    if (embedArray[embedArray.length - 1].fields.length < 25) {
      embedArray[embedArray.length - 1].addField(name, value, inline)
    } else {
      const embed = new MessageEmbed()
        .setColor('#0099ff').addField('- - - - - - - - - - - - - - - - - - - - - - - - - - - - Cont. - - - - - - - - - - - - - - - - - - - - - - - - - - - -', '\u200B', false)
      embed.addField(name, value, inline)
      embedArray.push(embed)
    }

    return embedArray
  }
}
