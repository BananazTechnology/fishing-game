import {
  ApplicationCommandSubCommandData,
  ButtonInteraction,
  Client
} from 'discord.js'
import { User } from '../classes/user'

export interface ButtonClick extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: ButtonInteraction, user?: User) => void;
}
