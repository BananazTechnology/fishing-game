import { Command } from './interfaces/command'
import { Shop } from './commands/shop/shop'
import { Fish } from './commands/fish/fish'
import { Profile } from './commands/profile/profile'
import { Set } from './commands/set/set'
import { Location } from './commands/location/location'
import { Restock } from './commands/restock/restock'
import { Codex } from './commands/codex/codex'
import { Tournament } from './commands/tournament/tournament'
import { Leaderboard } from './commands/leaderboard/leaderboard'
import { Help } from './commands/help/help'

export const Commands: Command[] = [Shop, Fish, Profile, Set, Location, Restock, Codex, Tournament, Leaderboard, Help]
