import { Command } from './interfaces/command'
import { Shop } from './commands/shop/shop'
import { Fish } from './commands/fish/fish'
import { Profile } from './commands/profile/profile'
import { Set } from './commands/set/set'

export const Commands: Command[] = [Shop, Fish, Profile, Set]
