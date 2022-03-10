import { Command } from './interfaces/command'
import { Test } from './commands/test'
import { Store } from './commands/store'
import { Fish } from './commands/fish'
import { Profile } from './commands/profile'

export const Commands: Command[] = [Store, Fish, Profile, Test]
