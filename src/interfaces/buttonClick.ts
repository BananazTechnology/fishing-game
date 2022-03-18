import {
  ApplicationCommandSubCommandData,
  ButtonInteraction,
  Client
} from 'discord.js'

export interface ButtonClick extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: ButtonInteraction) => void;
}
