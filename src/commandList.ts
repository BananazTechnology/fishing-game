import { Command } from './interfaces/command'
import { Shop } from './commands/shop'
import { Fish } from './commands/fish'
import { Profile } from './commands/profile'

export const Commands: Command[] = [Shop, Fish, Profile]
