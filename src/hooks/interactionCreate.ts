import {BaseCommandInteraction, Client, Interaction} from 'discord.js';
import {Commands} from '../commandList';

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

// eslint-disable-next-line max-len
const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({content: 'An error has occurred'});
    return;
  }

  await interaction.deferReply();

  console.log(`${interaction.user.username} ran ${slashCommand.name}`);
  slashCommand.run(client, interaction);
};
