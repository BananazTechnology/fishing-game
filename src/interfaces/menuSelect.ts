import {
  ApplicationCommandSubCommandData,
  Client,
  SelectMenuInteraction
} from 'discord.js'
import { User } from '../classes/user'

export interface MenuSelect extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: SelectMenuInteraction, user?: User) => void;
}
