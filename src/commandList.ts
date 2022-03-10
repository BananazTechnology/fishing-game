import {Command} from './interfaces/command';
import {Test} from './commands/test';
import {Buy} from './commands/buy';
import {Fish} from './commands/fish';
import {Profile} from './commands/profile';

export const Commands: Command[] = [Buy, Fish, Profile, Test];
