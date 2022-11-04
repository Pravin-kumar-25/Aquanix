require('dotenv').config()
const { Client, GatewayIntentBits, Collection, Events, REST,Routes } = require('discord.js');
const { Player } = require("discord-player")
const fs = require('node:fs')
const path = require('node:path')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

const commands = []
client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.on(Events.InteractionCreate, async (interaction) => {
    console.log('hola')
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute({ interaction, client })
    } catch (error) {
        await interaction.reply("wasted di maplai.....")
    }
})

// client.on(Events.InteractionCreate, async (interaction) => {
//     if(!interaction.isButton()) return;
// })

// client.once(Events.ClientReady, () => {
// 	console.log('Ready!');
// });

client.on('ready', () => {
    console.log('Listening to your commands..')
    // console.log(commands)

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
})


client.login(process.env.CLIENT_TOKEN)