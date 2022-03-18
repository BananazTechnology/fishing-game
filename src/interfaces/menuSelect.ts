import {
  ApplicationCommandSubCommandData,
  Client,
  SelectMenuInteraction
} from 'discord.js'

export interface MenuSelect extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: SelectMenuInteraction) => void;
}
