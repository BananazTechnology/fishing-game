import { Client, ClientOptions } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

const token = "OTUxMTgwMjI5ODQ0NTU3ODY0.Yijtng.Y9P4EyndcndYSjl6QQkEU9ivY6M";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(token);