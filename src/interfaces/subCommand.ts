import {
  ApplicationCommandSubCommandData,
  BaseCommandInteraction,
  Client
} from 'discord.js'
import { User } from '../classes/user'

export interface SubCommand extends ApplicationCommandSubCommandData {
    run: (client: Client, interaction: BaseCommandInteraction, user?: User) => void;
}
