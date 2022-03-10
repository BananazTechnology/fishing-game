import {
  ApplicationCommandOptionData,
  BaseCommandInteraction,
  Client,
} from 'discord.js';
import {Command} from '../interfaces/command';

const username: ApplicationCommandOptionData = {
  name: 'person',
  description: 'Returns a greeting',
  type: 'STRING',
};

export const Test: Command = {
  name: 'test',
  description: 'Test Command',
  type: 'CHAT_INPUT',
  options: [username],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    let content;
    if (interaction.options.get('person')?.value == undefined) {
      content = `Hello ${interaction.user}!`;
    } else {
      content = `Hello ${interaction.options.get('person')?.value}!`;
    }


    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
