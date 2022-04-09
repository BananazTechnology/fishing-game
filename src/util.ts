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

  static fourElementMultiEmbedBuilder (embedArray: MessageEmbed[], name1: string, value1: string, name2: string, value2: string, name3: string, value3: string, name4: string, value4: string, inline: boolean|undefined): MessageEmbed[] {
    if (embedArray[embedArray.length - 1].fields.length < 25) {
      embedArray[embedArray.length - 1].addFields(
        {name: name1, value: value1.toUpperCase(), inline: true},
        {name: name2, value: value2.toUpperCase(), inline: true},
        {name: name3, value: `${Number(value3) * 100}%`, inline: true},
        {name: name4, value: `${value4}$`, inline: true},
        {name: '- - - - - - - - - - - - - - - - - - - - -', value: '\u200B', inline: false},
      )
    } else {
      const embed = new MessageEmbed()
        .setColor('#0099ff').setTitle(`Fisherman Dave's Market`)
      //embed.addField(name, value, inline)
      embedArray.push(embed)
    }

    return embedArray
  }
}
