import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client
} from 'discord.js'
import { User } from '../classes/user'

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: BaseCommandInteraction, user?: User) => void;
}
