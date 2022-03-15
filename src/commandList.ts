import { Command } from './interfaces/command'
import { Shop } from './commands/shop/shop'
import { Fish } from './commands/fish/fish'
import { Profile } from './commands/profile/profile'

export const Commands: Command[] = [Shop, Fish, Profile]
