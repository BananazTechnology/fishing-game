import {
  ApplicationCommandSubCommandData,
  BaseCommandInteraction,
  Client
} from 'discord.js'

export interface SubCommand extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}
